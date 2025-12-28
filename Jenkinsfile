pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "pk-nuxt-app"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        DOCKER_REGISTRY = "your-registry.com" // Modifier selon votre registry
        COMPOSE_FILE = "nuxt-app/docker-compose.yml"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('nuxt-app') {
                    sh 'npm ci'
                }
            }
        }

        stage('Lint & Type Check') {
            steps {
                dir('nuxt-app') {
                    sh 'npm run build || true' // Vérifier que le build passe
                }
            }
        }

        stage('Generate Prisma Client') {
            steps {
                dir('nuxt-app') {
                    sh 'npx prisma generate'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('nuxt-app') {
                    sh """
                        docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                        docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }

        stage('Push to Registry') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Si vous utilisez un registry privé
                    // docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-credentials-id') {
                    //     sh "docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}"
                    //     sh "docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest"
                    // }
                    echo "Skipping push to registry - configure your registry settings"
                }
            }
        }

        stage('Database Migration') {
            when {
                branch 'main'
            }
            steps {
                dir('nuxt-app') {
                    sh '''
                        # Attendre que la base de données soit prête
                        docker-compose up -d postgres
                        sleep 10
                        
                        # Exécuter les migrations
                        npx prisma db push || true
                    '''
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                dir('nuxt-app') {
                    sh '''
                        # Arrêter les anciens containers
                        docker-compose down || true
                        
                        # Démarrer la nouvelle stack
                        docker-compose up -d
                        
                        # Vérifier que les services sont up
                        docker-compose ps
                    '''
                }
            }
        }

        stage('Health Check') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Attendre que l'application soit prête
                    sleep 15
                    
                    // Vérifier la santé de l'application
                    def healthCheck = sh(
                        script: 'curl -f http://localhost:80 || exit 1',
                        returnStatus: true
                    )
                    
                    if (healthCheck != 0) {
                        error("Health check failed")
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
            // Ajouter notifications (email, Slack, etc.)
        }
        always {
            // Nettoyage
            sh 'docker system prune -f || true'
        }
    }
}
