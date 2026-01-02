pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT_ID = '667659726830'  // Update this with your AWS Account ID
        ECR_REPOSITORY = 'pexifly-production/app'
        ECS_CLUSTER = 'pexifly_production_app'
        ECS_SERVICE = 'pexifly-production-app-task-service'
        ECS_TASK_DEFINITION = 'pexifly-production-app-task'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def imageTag = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG}"
                    
                    sh """
                        docker build -t ${ECR_REPOSITORY}:${IMAGE_TAG} .
                        docker tag ${ECR_REPOSITORY}:${IMAGE_TAG} ${imageTag}
                    """
                }
            }
        }

        stage('Push to ECR') {
            steps {
                script {
                    sh """
                        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                    """
                    
                    def imageTag = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG}"
                    sh "docker push ${imageTag}"
                }
            }
        }

        stage('Update ECS Task Definition') {
            steps {
                script {
                    def imageTag = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG}"
                    
                    sh """
                        # Get task definition
                        aws ecs describe-task-definition --task-definition ${ECS_TASK_DEFINITION} --region ${AWS_REGION} --query taskDefinition > task-definition.json
                        
                        # Use Python to filter metadata and update image (Python is usually available)
                        python3 << 'PYTHON_SCRIPT'
import json
import sys

# Read the task definition
with open('task-definition.json', 'r') as f:
    task_def = json.load(f)

# Remove metadata fields that can't be used in register-task-definition
fields_to_remove = ['taskDefinitionArn', 'revision', 'status', 'requiresAttributes', 
                    'compatibilities', 'registeredAt', 'registeredBy']
for field in fields_to_remove:
    task_def.pop(field, None)

# Update the image in the first container definition
if 'containerDefinitions' in task_def and len(task_def['containerDefinitions']) > 0:
    task_def['containerDefinitions'][0]['image'] = '${imageTag}'

# Write the updated task definition
with open('task-definition-updated.json', 'w') as f:
    json.dump(task_def, f, indent=2)
PYTHON_SCRIPT
                        
                        # Register new task definition
                        aws ecs register-task-definition --cli-input-json file://task-definition-updated.json --region ${AWS_REGION}
                        
                        # Clean up
                        rm -f task-definition.json task-definition-updated.json
                    """
                }
            }
        }

        stage('Deploy to ECS') {
            steps {
                script {
                    sh """
                        aws ecs update-service \
                            --cluster ${ECS_CLUSTER} \
                            --service ${ECS_SERVICE} \
                            --force-new-deployment \
                            --region ${AWS_REGION}
                    """
                }
            }
        }

    }

    post {
        always {
            sh 'docker system prune -f'
        }
        success {
            echo 'Deployment completed successfully!'
        }
        failure {
            echo 'Deployment failed. Check logs for details.'
        }
    }
}

