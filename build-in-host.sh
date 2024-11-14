docker build --no-cache -t localhost:8443/front_dev .
docker push localhost:8443/front_dev
docker-compose up -d