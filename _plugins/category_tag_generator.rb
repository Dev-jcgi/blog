# frozen_string_literal: true

# Plugin para generar páginas individuales de categorías y tags
# Compatible con GitHub Pages usando approach de generación manual

module Jekyll
  # Generador de páginas de categorías
  class CategoryPageGenerator < Generator
    safe true

    def generate(site)
      if site.layouts.key? 'category'
        site.categories.each_key do |category|
          site.pages << CategoryPage.new(site, site.source, category)
        end
      end
    end
  end

  # Página de categoría
  class CategoryPage < Page
    def initialize(site, base, category)
      @site = site
      @base = base
      @dir = File.join('categoria', category.downcase.gsub(' ', '-'))
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'category.html')
      self.data['category'] = category
      self.data['title'] = "Categoría: #{category}"
    end
  end

  # Generador de páginas de tags
  class TagPageGenerator < Generator
    safe true

    def generate(site)
      if site.layouts.key? 'tag'
        site.tags.each_key do |tag|
          site.pages << TagPage.new(site, site.source, tag)
        end
      end
    end
  end

  # Página de tag
  class TagPage < Page
    def initialize(site, base, tag)
      @site = site
      @base = base
      @dir = File.join('tag', tag.downcase.gsub(' ', '-'))
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'tag.html')
      self.data['tag'] = tag
      self.data['title'] = "Tag: #{tag}"
    end
  end
end
