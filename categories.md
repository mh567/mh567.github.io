---
layout: page
title: 分类浏览
permalink: /categories.html
---

<script src="/assets/js/category.js"></script>

{% assign categories = site.categories | sort %}
{% for category in categories %}

<h2 id="{{ category[0] | slugify }}">{{ category[0] }}</h2>

{% assign cat_name = category[0] %}
{% include post_list.html category=cat_name %}

{% endfor %}
