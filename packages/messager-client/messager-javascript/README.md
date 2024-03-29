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

+ [`JavaScript`][messager-client-javascript];
+ [`Python`][messager-client-python].

The [`messager-server`][messager-server] uses [plurid](https://github.com/plurid/plurid) to explore information as a 3D structure.



### Contents

+ [About](#about)
+ [Packages](#packages)
+ [Codeophon](#codeophon)



## About

The `messager` client can be configured to use WebSockets, kind `socket`, or Server Sent Events, kind `event`. WebSockets can be used in browsers or in `NodeJS` environments; Server Sent Events can be used in browsers.

Once configured with a `host`, the `messager` server, and `token`, the `messager` client can `publish`, `subscribe`, and/or `notify`.

The `token` is generated from the `messager` server and can be restricted to certain origins, IPs, or use a certain key.

The subscribe/publish topics can be any string; customarily, they respect a `'<domain>.<details>.<specification>:<id>'` shape.


``` typescript
import Messager from '@plurid/messager';


const messager = new Messager(
    'messager.plurid.cloud',
    'token',
    'socket', // default 'event'
);
// // or connecting to local messager server on 'localhost:56865'
// const messager = new Messager(
//     'localhost:56865',
//     '__TEST_MODE__',
//     'event',
//     {
//         secure: false,
//     },
// );


interface Data {
    value: boolean;
}

messager.subscribe<Data>('some.topic', (data) => {
    // do things with data
    console.log(data);
});

messager.publish<Data>(
    'some.topic',
    { value: true },
);

messager.notify<Data>(
    'id-of-another-messager',
    { value: true },
);
```



## Packages

<a target="_blank" href="https://www.npmjs.com/package/@plurid/messager-server">
    <img src="https://img.shields.io/npm/v/@plurid/messager-server.svg?logo=npm&colorB=1380C3&style=for-the-badge" alt="Version">
</a>

[@plurid/messager-server][messager-server] • the server application

[messager-server]: https://github.com/plurid/messager/tree/master/packages/messager-server


<a target="_blank" href="https://www.npmjs.com/package/@plurid/messager">
    <img src="https://img.shields.io/npm/v/@plurid/messager.svg?logo=npm&colorB=1380C3&style=for-the-badge" alt="Version">
</a>

[@plurid/messager-client-javascript][messager-client-javascript] • the `JavaScript` client

[messager-client-javascript]: https://github.com/plurid/messager/tree/master/packages/messager-client/messager-javascript


<a target="_blank" href="https://pypi.org/project/messager">
    <img src="https://img.shields.io/pypi/v/messager.svg?logo=pypi&colorB=1380C3&style=for-the-badge" alt="Version">
</a>

[@plurid/messager-client-python][messager-client-python] • the `Python` client

[messager-client-python]: https://github.com/plurid/messager/tree/master/packages/messager-client/messager-python



## [Codeophon](https://github.com/ly3xqhl8g9/codeophon)

+ licensing: [delicense](https://github.com/ly3xqhl8g9/delicense)
+ versioning: [αver](https://github.com/ly3xqhl8g9/alpha-versioning)
