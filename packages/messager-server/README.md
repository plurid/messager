<p align="center">
    <img src="https://raw.githubusercontent.com/plurid/messager/master/about/identity/messager-logo.png" height="250px">
    <br />
    <br />
    <a target="_blank" href="https://github.com/plurid/messager/blob/master/LICENSE">
        <img src="https://img.shields.io/badge/license-DEL-blue.svg?colorB=1380C3&style=for-the-badge" alt="License: DEL">
    </a>
</p>



<h1 align="center">
    messager
</h1>


<h3 align="center">
    Cloud Service for Centralized Message Queuing
</h3>



`messager` is a [service](https://messager.plurid.cloud) or self-hosted messaging queue.

`messager` is intended to be:

+ centralized, single messaging space for multi-project/multi-package software systems;

`messager` has clients for:

+ [`NodeJS`][messager-client-javascript];
+ [`Python`][messager-client-python].

The [`messager-server`][messager-server] uses [plurid](https://github.com/plurid/plurid) to explore information as a 3D structure.



### Contents

+ [About](#about)
+ [Client](#client)
    + [Support](support)
    + [Configuration](configuration)
+ [Server](#server)
    + [Building](building)
    + [Testing](testing)
+ [Packages](#packages)
+ [Codeophon](#codeophon)



## About

`messager` acts as a central messaging service. Once configured with a `token`, the `messager` client can point to the network `endpoint`, passing the `token`.




## Client

### Support

`messager` has client support for

+ [`NodeJS`][messager-client-javascript]
+ [`Python`][messager-client-python]


### Configuration

The following environment variables can be set

```
// messager server endpoint
MESSAGER_ENDPOINT = string
// messager server token
MESSAGER_TOKEN = string

// project name
MESSAGER_PROJECT = string
// space name
MESSAGER_SPACE = string


// calling details
MESSAGER_CALL_CONTEXT = true | false
MESSAGER_REPOSITORY_PROVIDER = string
MESSAGER_REPOSITORY_NAME = string
MESSAGER_REPOSITORY_COMMIT = string
MESSAGER_REPOSITORY_BRANCH = string
MESSAGER_REPOSITORY_BASEPATH = string
```



## Server

### Building

```
docker build \
    -t messager-server \
    -f ./configurations/production.dockerfile \
    --build-arg PORT=56965 \
    --build-arg MESSAGER_ENDPOINT_GRAPHQL=/ \
    --build-arg MESSAGER_DATABASE_TYPE=mongo \
    --build-arg MESSAGER_LOG_LEVEL=0 \
    --build-arg MESSAGER_QUIET=false \
    --build-arg MESSAGER_CUSTOM_LOGIC_USAGE=false \
    --build-arg MESSAGER_PRIVATE_USAGE=true \
    --build-arg MESSAGER_PRIVATE_OWNER_IDENTONYM=identonym \
    --build-arg MESSAGER_PRIVATE_OWNER_KEY=key \
    --build-arg MESSAGER_PRIVATE_TOKEN=secret-token \
    --build-arg MESSAGER_MONGO_USERNAME=admin \
    --build-arg MESSAGER_MONGO_PASSWORD=1234 \
    --build-arg MESSAGER_MONGO_ADDRESS=localhost:56966 \
    --build-arg MESSAGER_MONGO_CONNECTION_STRING= \
    --build-arg MESSAGER_TEST_MODE=true \
    --build-arg MESSAGER_OPTIMIZATION_BATCH_WRITE_SIZE=1000 \
    --build-arg MESSAGER_OPTIMIZATION_BATCH_WRITE_TIME=2000 \
    .
```

Run the container with `--network="host"` if running the database on the same host.

```
docker run \
    --network="host" \
    -d messager-server
```

Or run on a custom port (`8855`)

```
docker run \
    -d -p 8855:56965 \
    messager-server
```


### Testing

The `messager server` can use MongoDB as a database. For testing purposes, mongo can run in a docker container.

```
docker pull mongo
```

```
docker run -d --name mongo-messager \
    -p 56966:27017 -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=1234 mongo
```

Connect to the mongo instance with

```
mongodb://admin:1234@localhost:56966/?authSource=admin
```

to verify the connection.



## Packages

<a target="_blank" href="https://www.npmjs.com/package/@plurid/messager-server">
    <img src="https://img.shields.io/npm/v/@plurid/messager-server.svg?logo=npm&colorB=1380C3&style=for-the-badge" alt="Version">
</a>

[@plurid/messager-server][messager-server] • the server application

[messager-server]: https://github.com/plurid/messager/tree/master/packages/messager-server


<a target="_blank" href="https://www.npmjs.com/package/@plurid/messager">
    <img src="https://img.shields.io/npm/v/@plurid/messager.svg?logo=npm&colorB=1380C3&style=for-the-badge" alt="Version">
</a>

[@plurid/messager-client-javascript][messager-client-javascript] • the `NodeJS` client

[messager-client-javascript]: https://github.com/plurid/messager/tree/master/packages/messager-client/messager-javascript


<a target="_blank" href="https://pypi.org/project/messager">
    <img src="https://img.shields.io/pypi/v/messager.svg?logo=pypi&colorB=1380C3&style=for-the-badge" alt="Version">
</a>

[@plurid/messager-client-python][messager-client-python] • the `Python` client

[messager-client-python]: https://github.com/plurid/messager/tree/master/packages/messager-client/messager-python



## [Codeophon](https://github.com/ly3xqhl8g9/codeophon)

+ licensing: [delicense](https://github.com/ly3xqhl8g9/delicense)
+ versioning: [αver](https://github.com/ly3xqhl8g9/alpha-versioning)
