# Grimpo6 CLI

This CLI does stuff related to Grimpo6 association, such as:

- Generate mailing lists for [OVHcloud](https://www.ovhcloud.com).
- Download documents such as certificates and disclaimers.

## Installation

You have to install a recent version of [Node.js](https://nodejs.org).

Then, install the CLI using:

```sh
npm install git@github.com:grimpo6/grimpo6-cli.git --global
```

> Enter `npm uninstall grimpo6-cli --global` to uninstall it.

## Usage

You need to get API credentials (**clientId** and **clientSecret**) from [HelloAsso](https://admin.helloasso.com/grimpo6/integrations).

### Generate mailing lists

```sh
grimpo6 mailing --client-id fakeid --client-secret fakesecret --president-emails florian@example.com loraine@example.com --subscription-year 2024
```

It generates one file per mailing list, that you have to manually upload on [OVHcloud](https://www.ovh.com/manager/#/web/email_domain/grimpo6.org/mailing-list).

> Enter `grimpo6 mailing --help` for more informations.

### Download documents

```sh
grimpo6 document --client-id fakeid --client-secret fakesecret --subscription-year 2024
```

It downloads documents (certificates and disclaimers) of all members.

> Enter `grimpo6 document --help` for more informations.

## Disclaimer

This program has been built to support forms in 2024. It could be not compatible with previous subscriptions.
