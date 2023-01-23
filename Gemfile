source "https://rubygems.org"

# Always use what's in github-pages prod.
# https://byparker.com/blog/2014/stay-up-to-date-with-the-latest-github-pages-gem/
require 'json'
require 'open-uri'
versions = JSON.parse(::URI.open('https://pages.github.com/versions.json').read)

gem 'github-pages', versions['github-pages'], group: :jekyll_plugins

# If you have any plugins, put them here!
group :jekyll_plugins do
  gem "jekyll-avatar", versions['jekyll-avatar']
  gem "jekyll-coffeescript", versions['jekyll-coffeescript']
  gem "jekyll-default-layout", versions['jekyll-default']
  gem "jekyll-feed", versions['jekyll-feed']
  gem "jekyll-gist", versions['jekyll-gist']
  gem "jekyll-github-metadata", versions['jekyll-github-metadata']
  gem "jekyll-optional-front-matter", versions['jekyll-optional-front-matter']
  gem "jekyll-paginate", versions['jekyll-paginate']
  gem "jekyll-readme-index", versions['jekyll-readme-index']
  gem "jekyll-relative-links", versions['jekyll-relative-links']
  gem "jekyll-sitemap", versions['jekyll-sitemap']
  gem "jekyll-titles-from-headings", versions['jekyll-titles-from-headings']
  gem "jekyll-seo-tag", versions['jekyll-seo-tag']
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.0", :platforms => [:mingw, :x64_mingw, :mswin]

# kramdown v2 ships without the gfm parser by default
gem "kramdown-parser-gfm"

# https://github.com/github/pages-gem/issues/752
gem "webrick", "~> 1.7"

# http://jekyll.github.io/github-metadata/authentication/
gem "netrc", "~> 0.11.0"
