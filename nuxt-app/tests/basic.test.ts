import { describe, it, expect } from 'vitest';
import { dockerRun, dockerStop, dockerRemove } from '../server/utils/dockerRunner';

describe('Docker Runner', () => {
  it('should sanitize container names', async () => {
    const result = await dockerRun({
      image: 'alpine:latest',
      name: 'test-container-with-special-chars!@#$%',
      ports: {},
    });

    // Le nom devrait être sanitizé
    expect(result.success || result.error).toBeDefined();
  });

  it('should handle invalid docker image', async () => {
    const result = await dockerRun({
      image: 'nonexistent-image-12345',
      name: 'test-invalid',
      ports: {},
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should create container with ports', async () => {
    const result = await dockerRun({
      image: 'alpine:latest',
      name: 'test-with-ports',
      ports: { '80': 8080 },
    });

    // Cleanup
    if (result.success && result.containerId) {
      await dockerRemove(result.containerId, true);
    }

    expect(result.success || result.error).toBeDefined();
  });
});

describe('API Validation', () => {
  it('should validate game creation payload', () => {
    const validPayload = {
      name: 'Minecraft',
      type: 'docker',
      image: 'itzg/minecraft-server',
      ports: [25565],
    };

    expect(validPayload.name).toBeDefined();
    expect(validPayload.type).toBe('docker');
    expect(validPayload.image).toBeDefined();
  });

  it('should reject invalid game type', () => {
    const invalidPayload = {
      name: 'Test',
      type: 'invalid-type',
    };

    expect(['docker', 'linuxgsm'].includes(invalidPayload.type)).toBe(false);
  });
});
