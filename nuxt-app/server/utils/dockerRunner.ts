import { spawn } from 'child_process';

export interface DockerContainerConfig {
  image: string;
  name: string;
  ports?: { [containerPort: string]: number }; // ex: { "25565": 25565 }
  volumes?: string[]; // ex: ["./data:/data"]
  env?: { [key: string]: string }; // ex: { EULA: "TRUE" }
  network?: string;
  user?: string; // ex: "1000:1000" ou "root"
  privileged?: boolean; // Pour certains serveurs qui nécessitent des permissions élevées
  restart?: string; // ex: "unless-stopped"
}

export interface DockerRunResult {
  success: boolean;
  containerId?: string;
  error?: string;
  logs?: string;
}

/**
 * Exécute une commande docker de manière sécurisée avec timeout
 */
function execDocker(args: string[], timeout: number = 30000): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve, reject) => {
    const process = spawn('docker', args, { 
      shell: true,
      windowsHide: true
    });

    let stdout = '';
    let stderr = '';

    const timer = setTimeout(() => {
      process.kill();
      reject(new Error(`Docker command timed out after ${timeout}ms`));
    }, timeout);

    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      clearTimeout(timer);
      resolve({ stdout: stdout.trim(), stderr: stderr.trim(), exitCode: code || 0 });
    });

    process.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

/**
 * Lance un container Docker
 */
export async function dockerRun(config: DockerContainerConfig): Promise<DockerRunResult> {
  try {
    const args = ['run', '-d', '--name', sanitizeName(config.name)];

    // User (pour les permissions)
    if (config.user) {
      args.push('--user', config.user);
    }

    // Privileged mode (pour certains serveurs)
    if (config.privileged) {
      args.push('--privileged');
    }

    // Restart policy
    if (config.restart) {
      args.push('--restart', config.restart);
    }

    // Ports
    if (config.ports) {
      for (const [containerPort, hostPort] of Object.entries(config.ports)) {
        // Pour les serveurs de jeux, utiliser UDP par défaut
        // Format: hostPort:containerPort/protocol
        args.push('-p', `${hostPort}:${containerPort}/udp`);
        // Ajouter aussi TCP pour certains services (RCON, etc.)
        args.push('-p', `${hostPort}:${containerPort}/tcp`);
      }
    }

    // Volumes
    if (config.volumes) {
      for (const volume of config.volumes) {
        args.push('-v', volume);
      }
    }

    // Environment variables
    if (config.env) {
      for (const [key, value] of Object.entries(config.env)) {
        args.push('-e', `${key}=${value}`);
      }
    }

    // Network
    if (config.network) {
      args.push('--network', config.network);
    }

    // Image
    args.push(config.image);

    const result = await execDocker(args, 60000);

    if (result.exitCode !== 0) {
      return {
        success: false,
        error: result.stderr || result.stdout,
      };
    }

    return {
      success: true,
      containerId: result.stdout,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Arrête un container Docker
 */
export async function dockerStop(containerIdOrName: string): Promise<DockerRunResult> {
  try {
    const result = await execDocker(['stop', sanitizeName(containerIdOrName)], 30000);

    if (result.exitCode !== 0) {
      return {
        success: false,
        error: result.stderr || result.stdout,
      };
    }

    return {
      success: true,
      logs: result.stdout,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Démarre un container Docker existant
 */
export async function dockerStart(containerIdOrName: string): Promise<DockerRunResult> {
  try {
    const result = await execDocker(['start', sanitizeName(containerIdOrName)], 30000);

    if (result.exitCode !== 0) {
      return {
        success: false,
        error: result.stderr || result.stdout,
      };
    }

    return {
      success: true,
      logs: result.stdout,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Supprime un container Docker
 */
export async function dockerRemove(containerIdOrName: string, force: boolean = true): Promise<DockerRunResult> {
  try {
    const args = ['rm'];
    if (force) args.push('-f');
    args.push(sanitizeName(containerIdOrName));

    const result = await execDocker(args, 30000);

    if (result.exitCode !== 0) {
      return {
        success: false,
        error: result.stderr || result.stdout,
      };
    }

    return {
      success: true,
      logs: result.stdout,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Récupère les logs d'un container
 */
export async function dockerLogs(containerIdOrName: string, tail: number = 100): Promise<DockerRunResult> {
  try {
    const result = await execDocker(['logs', '--tail', tail.toString(), sanitizeName(containerIdOrName)], 10000);

    return {
      success: true,
      logs: result.stdout || result.stderr,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Récupère le statut d'un container
 */
export async function dockerInspect(containerIdOrName: string): Promise<DockerRunResult & { status?: string }> {
  try {
    const result = await execDocker(['inspect', '--format', '{{.State.Status}}', sanitizeName(containerIdOrName)], 10000);

    if (result.exitCode !== 0) {
      return {
        success: false,
        error: result.stderr || 'Container not found',
      };
    }

    return {
      success: true,
      status: result.stdout,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Sanitize container name pour éviter injection
 */
function sanitizeName(name: string): string {
  // Retire caractères dangereux et limite à alphanumeric + underscore + dash
  return name.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 63);
}
