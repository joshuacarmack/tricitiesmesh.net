---
date: 2025-10-03
title: Installing a node on Bays Mountain
linkTitle: Bays Mountain Node
description: >
  Our process of installing a node on top of Bays Mountain in Kingsport, TN.
author: Joshua Carmack
resources:
  - src: "**.{png,jpg}"
    title: "Image #:counter"
    params:
      byline: "Photo: Joshua Carmack"
---

**This is a typical blog post that includes images.**

The front matter specifies the date of the blog post, its title, a short description that will be displayed on the blog landing page, and its author.

## Including images

Here's an image (`featured-sunset-get.png`) that includes a byline and a caption.

{{< imgproc sunset Fill "600x300" >}}
Fetch and scale an image in the upcoming Hugo 0.43.
{{< /imgproc >}}

The front matter of this post specifies properties to be assigned to all image resources:

```
resources:
- src: "**.{png,jpg}"
  title: "Image #:counter"
  params:
    byline: "Photo: Riona MacNamara / CC-BY-CA"
```

To include the image in a page, specify its details like this:

```go-html-template
{{</* imgproc sunset Fill "600x300" */>}}
Fetch and scale an image in the upcoming Hugo 0.43.
{{</* /imgproc */>}}
```

The image will be rendered at the size and byline specified in the front matter.
