# Hướng dẫn sử dụng docker trong project

Hướng dẫn này áp dụng cho việc sử dụng docker để tạo môi trường dev ở local, tạo thuận lợi cho các thành viên trong team phát triển. Vì vậy, ở đây chúng ta thường sử dụng lại những **image** có sẵn để giảm thời gian build môi trường.

Việc setup môi trường production cần xem xét về hiệu năng, tài nguyên server và quy trình deploy khác nên có thể không dùng docker hoặc phải build custom image cho phù hợp.

## Một số khái niệm
Để cho dễ hiểu, các khái niệm dưới đây được liên hệ với các khái niệm về máy ảo. Mặc dù cách triển khai là khác nhau nhưng đều có chung 1 tư tưởng.

- Host machine: chỉ máy thật hay hệ điều hành trên máy tính thật
- Container: máy ảo tạo ra bởi docker
- Image: là một tập các lệnh thay đổi hệ điều hành cơ sở (được định nghĩa trong file `Dockerfile`) (ví dụ: cài thêm phần mềm, thiết lập lại cấu hình,...) để tạo ra container. Có thể hiểu đơn giản là nó giống như file ISO dùng để cài máy ảo (hệ điều hành). Từ image có thể tạo ra nhiều container.

## Docker compose
Docker compose giúp chúng ta quản lý các container trong project bằng cách định nghĩa các service trong file cấu hình yaml, thay vì phải quản lý, start, stop từng container.

VD file yaml:
```yml
version: "2"

services:
  workspace:
    image: node:10
    restart: always
    user: node
    tty: true
    working_dir: /home/node/app
    volumes:
      - ./:/home/node/app
    expose:
      - 3030 # Backend server (feathersjs)
      - 3000 # Frontend server dev (react)
    ports:
      - 3033:3030
      - 3003:3003
```
Dòng đầu tiên chỉ định version của file config để docker-compose có thể hiểu được. Version mới nhất mà docker compose support đó là version 3.

Tiếp theo là đến khai báo các `services` tức là khai báo các bước để tạo ra container tương ứng. Theo ví dụ ở trên:
- `image: node:10`: sử dụng image [`node`](https://hub.docker.com/_/node/), version `10` để tạo container
- `restart: always`: restart container sau khi restart docker hoặc khởi động lại máy
- `user: node`: user mặc định khi access vào container từ host machine
- `working_dir: /home/node/app`: đường dẫn mặc định khi access vào container từ host machine
- ```yml
  volumes:
    - ./:/home/node/app
  ```
  Mount thư mục hiện tại ở host machine vào thư mục `/home/node/app` trong máy ảo. Tức là nếu thư mục có thay đổi gì ở host machine thì thư mục trong container cũng tự động được đồng bộ và ngược lại.
- ```yml
  expose:
    - 3030 # Backend server (feathersjs)
    - 3000 # Frontend server dev (react)
  ```
  Chỉ dẫn cho biết trong container có service đang chạy ở cổng 3030 và 3000
- ```yml
  ports:
    - 3033:3030
    - 3003:3000
  ```
  Ánh xạ cổng ở host machine với cổng trong container. Tức là khi truy cập vào địa chỉ `localhost:3033` trên host machine, docker sẽ chuyển tiếp đến cổng `3030` trong container tương ứng.

Sau khi định nghĩa xong file yml, tiếp theo là đến bước `up` để khởi tạo các container:
```bash
docker-compose up -d
```
Chú ý với option `-d` (`--detach`) thì sau khi tạo xong container thì các containers sẽ được chạy ngầm và không có ouput nào trên màn hình terminal. Trong quá trình debug chúng ta có thể bỏ option này đi để theo dõi quá trình các container được tạo ra như thế nào. Hoặc có thể dùng lệnh `docker-compose logs` để xem lại logs.

Để kiểm tra có những service nào đang hoạt động, dùng lệnh:
```bash
docker-compose ps
```
=>
```bash
docker-compose ps
               Name                       Command               State                       Ports
---------------------------------------------------------------------------------------------------------------------
feathers-react-stack_workspace_1    docker-entrypoint.sh node    Up    0.0.0.0:3003->3000/tcp, 0.0.0.0:3033->3030/tcp
```
Ở cột `Ports` chúng ta có mô tả ánh xạ port giữa host machine và container.

Để access vào trong container, có 2 cách là thông qua container name (VD: `feathers-react-stack_workspace_1`) hoặc thông qua service name được khai báo trong file yaml (VD: `workspace`):
```bash
docker exec -it feathers-react-stack_workspace_1 bash
docker exec feathers-react-stack_workspace_1 node -v
```
Hoặc theo cách thuận tiện hơn:
```bash
docker-compose exec workspace bash
docker-compose exec workspace node -v
```

Ngoài container workspace để chạy node và react, chúng ta có thể cần thêm một số container sau:
- `mongo`: mongodb server
  ```yaml
  mongo:
    image: mongo:4
    restart: always
    volumes:
      - ./docker/mongo/data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: secret
  ```
- `mongo-express`: web ui để access vào mongodb server (tương tự adminer hay phpmyadmin)
- `mail-server`: mail server để gửi và xem mail. Ở môi trường dev, best practice là không dùng mail thật để test do đó ở đây chúng ta dùng `mailhog` để tạo ra một mail server dành riêng cho mục đích test
- `redis`: redis server, có thể dùng cho việc cache data, session...
- `swagger`: swagger editor để xem api docs

Docker compose tạo ra một network riêng cho các container (một mạng LAN riêng chỉ bao gồm các máy ảo container), do đó trong container ta có thể truy cập đến các container khác thông qua hostname của từng container (hostname ở đây có thể là container id, container name hoặc service name định nghĩa trong file yaml), không cần biết ip của từng container. Chẳng hạn access vào container `workspace` và thực hiện ping:
```
docker-compose exec workspace bash
ping feathers-react-stack_mongo_1
ping mongo
```
Vì thế khi config địa chỉ database chúng ta chỉ cần tham chiếu bằng tên service, chẳng hạn config trong FeatherJS:
```json
{
  "mongodb": "mongodb://mongo:27017/my_db"
}
```

> Note: có thể sử dụng docker mà không cần `sudo` bằng cách add user hiện tại vào group `docker`
> ```bash
> sudo groupadd docker
> sudo usermod -aG docker $USER
> ```
> Logout và login lại để update lại hệ thống.
> Reference: https://docs.docker.com/install/linux/linux-postinstall/

Thường thì chúng ta sẽ có 1 file `docker-compose.yml` chung cho project để đảm bảo môi trường dev giống nhau, tuy nhiên vẫn có trường hợp bị xung đột cổng ở máy dev.

Nếu không muốn sửa file `docker-compose.yml` (vì ảnh hưởng đến git changes), chúng ta có thể tạo file có tên `docker-compose.override.yml`, mặc định `docker-compose` sẽ đọc 2 file `docker-compose.yml` và `docker-compose.override.yml` và merge các config lại trước khi thực hiện start container.

Ví dụ thay đổi ports (`docker-compose.override.yml`):
```yaml
version: "2"

services:
  mongo-express:
    ports:
      - 8999:8081
```
