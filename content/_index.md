---
# Leave the homepage title empty to use the site title
title: ""
date: 2022-10-24
type: landing

design:
  # Default section spacing
  spacing: "3rem"

sections:
  - block: community/resume-biography-adjavatar
    id: about
    content:
      # Choose a user profile to display (a folder name within `content/authors/`)
      username: admin
      text: ""
      # Show a call-to-action button under your biography? (optional)
      button:
        text: Download CV
        url: uploads/Hempel_CV.pdf
    design:
      css_class: dark
      background:
        image:
          # Add your image background to `assets/media/`.
          filename: maybebackground.png
          filters:
            brightness: 1.0
          size: cover
          position: center
          parallax: false
  - block: collection
    id: research
    content:
      title: Working Papers
      text: ""
      filters:
        folders:
          - publication
        exclude_featured: false
    design:
      view: community/mycard
  #- block: collection
    # id: teaching
    # content:
    #   title: Teaching
    #   text: ""
    #   filters:
    #     folders:
    #       - teaching
    #     exclude_featured: false
    # design:
    #   view: article-grid
    #   columns: 2
---
