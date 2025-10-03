---
title: Contribution Guidelines
description: How to contribute to the docs
weight: 10
---

{{% pageinfo %}}

These basic sample guidelines assume that your Docsy site is deployed using Netlify and your files are stored in GitHub. You can use the guidelines "as is" or adapt them with your own instructions: for example, other deployment options, information about your doc project's file structure, project-specific review guidelines, versioning guidelines, or any other information your users might find useful when updating your site. [Kubeflow](https://github.com/kubeflow/website/blob/master/README.md) has a great example.

Don't forget to link to your own doc repo rather than our example site! Also make sure users can find these guidelines from your doc repo README: either add them there and link to them from this page, add them here and link to them from the README, or include them in both locations.

{{% /pageinfo %}}

We use [Hugo](https://gohugo.io/) to format and generate our website, the
[Docsy](https://github.com/google/docsy) theme for styling and site structure,
and [Netlify](https://www.netlify.com/) to manage the deployment of the site.
Hugo is an open-source static site generator that provides us with templates,
content organisation in a standard directory structure, and a website generation
engine. You write the pages in Markdown (or HTML if you want), and Hugo wraps them up into a website.

All submissions, including submissions by project members, require review. We
use GitHub pull requests for this purpose. Consult
[GitHub Help](https://help.github.com/articles/about-pull-requests/) for more
information on using pull requests.

## Updating a single page

If you've just spotted something you'd like to change while using the docs, Docsy has a shortcut for you:

1. Click **Edit this page** in the top right hand corner of the page.
1. If you don't already have an up to date fork of the project repo, you are prompted to get one - click **Fork this repository and propose changes** or **Update your Fork** to get an up to date version of the project to edit. The appropriate page in your fork is displayed in edit mode.
1. Follow the rest of the [Quick start with Netlify](#quick-start-with-netlify) process above to make, preview, and propose your changes.


## Creating an issue

If you've found a problem in the docs, but you're not sure how to fix it yourself, please create an issue in the [Goldydocs repo](https://github.com/google/docsy-example/issues). You can also create an issue about a specific page by clicking the **Create Issue** button in the top right hand corner of the page.

## Useful resources

* [Docsy user guide](https://www.docsy.dev/docs/): All about Docsy, including how it manages navigation, look and feel, and multi-language support.
* [Hugo documentation](https://gohugo.io/documentation/): Comprehensive reference for Hugo.
* [Github Hello World!](https://guides.github.com/activities/hello-world/): A basic introduction to GitHub concepts and workflow.
