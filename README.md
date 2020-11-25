# About
This is a Vue application that provides a graphical user interface for
querying books available at your local library.

Try it out at [biblio.dcain.me][biblio]!

[![A list of titles available at my local library][reading-list-img]][biblio]

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


# TODO
This is a pet project I work on whenever I'm so inclined.

I'm also using this project as an excuse to learn Vue.

There are some broader UX improvements & algorithm improvements to be
made (all detailed in the [bibliophile][bibliophile] repo).

## Build improvements
- Better TypeScript support for Vue

## Miscellaneous improvements
- Tell axios that api.dcain.me is okay with CORS
    - (this will save unnecessary OPTIONS requests)
- Include only the icons we need (no need to bundle them all)
    - Make sure to check if there's a tree-shaking option available


### Attribution
Favicon [licensed by FontAwesome][favicon-license].


[biblio]: https://biblio.dcain.me
[favicon-license]: https://fontawesome.com/license
[bibliophile]: https://github.com/DavidCain/bibliophile
[bibliophile-backend]: https://github.com/DavidCain/bibliophile-backend
[reading-list-img]: screenshots/reading_list.png
