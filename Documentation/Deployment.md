# Deployment

10.108.50.0

sysadm

andeby!andeby spørg it support om hvad det betyder

systemctl restart MechanicBackend && systemctl status MechanicBackend 
systemctl restart nginx && systemctl status nginx

## Backend

### Backend path
var/www/DeploymentFolder

replace all files in this folder when deploying and restart the service

### Video Path

/home/sysadm/videos

#### Command
Service MechanicApp restart

Make sure it runs

## Frontend

### Frontend path

var/www/Website

replace all files in this folder when deploying and restart Nginx

#### Command

Service Nginx Restart
