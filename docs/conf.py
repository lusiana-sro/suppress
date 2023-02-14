# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'Suppress.js'
copyright = '2023, Daniel Alves Rosel'
author = 'Daniel Alves Rosel'
release = '1.3.2'


# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = ["myst_parser"]

templates_path = ['_templates']
exclude_patterns = []

master_doc = 'index'





# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "sphinx_book_theme"
html_title = ""
html_static_path = ['_static']

html_logo = "./logo.png"
# have the toc on the side with 2 levels
html_theme_options = {
    "show_navbar_depth": 2,
    "repository_url": "https://github.com/velocitatem/suppress/tree/main"
}
