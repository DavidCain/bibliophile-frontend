# About
This is a Vue application that provides a graphical user interface for
querying books available at your local library.

Try it out at [biblio.dcain.me][biblio]!

## Supporting projects

This application hits an API endpoint hosted on AWS which makes use of
a Python package to provide the "glue."

- [Python package to read from Goodreads, query library catalogs][bibliophile-backend]
- [AWS Lambda functions to build a public API][bibliophile]


# Running locally
```bash
npm run serve
```

# Deployment
Run `npm run build`, and copy the contents of `dist` to an S3 bucket
configured with static site hosting.

To smoke test before deployment:

```bash
npm install -g serve
serve dist
open http://localhost:5000/  # (Will also be on clipboard)
```



### Attribution
Favicon [licensed by FontAwesome][favicon-license].


[biblio]: https://biblio.dcain.me
[favicon-license]: https://fontawesome.com/license
[bibliophile]: https://github.com/DavidCain/bibliophile
[bibliophile-backend]: https://github.com/DavidCain/bibliophile-backend
