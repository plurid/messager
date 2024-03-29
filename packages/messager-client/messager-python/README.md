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

`messager` is intended to:

+ be a centralized, single messaging space for multi-project software systems;
+ handle publish/subscribe, notify across multiple users, tokens, domains.

`messager` has clients for:

+ [`NodeJS`][messager-client-javascript];
+ [`Python`][messager-client-python].

The [`messager-server`][messager-server] uses [plurid](https://github.com/plurid/plurid) to explore information as a 3D structure.



### Contents

+ [About](#about)
+ [Client](#client)
+ [Server](#server)
+ [Packages](#packages)
+ [Codeophon](#codeophon)



## About

`messager` acts as a central messaging service. Once configured with a `token`, the `messager` client can point to the network `endpoint`, passing the `token`.



## Client

### Support

`messager` has client support for

+ [`NodeJS`][messager-client-javascript]
+ [`Python`][messager-client-python]



## Server

The `messager` server allows the client to connect over `web sockets` and `server sent events`.



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
