import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/07-document-metadata')({
  component: RouteComponent,
})

function RouteComponent() {
  const [currentExample, setCurrentExample] = useState<'basic' | 'dynamic' | 'seo'>('basic')

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Document Metadata w React 19</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          React 19 pozwala na bezpośrednie renderowanie elementów <code className="bg-orange-200 px-1 rounded">&lt;title&gt;</code>, 
          <code className="bg-orange-200 px-1 rounded">&lt;meta&gt;</code> i <code className="bg-orange-200 px-1 rounded">&lt;link&gt;</code> 
          w komponentach, które automatycznie trafiają do sekcji head dokumentu.
        </p>
        
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setCurrentExample('basic')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              currentExample === 'basic'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Podstawowe metadata
          </button>
          <button
            onClick={() => setCurrentExample('dynamic')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              currentExample === 'dynamic'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Dynamiczne zmiany
          </button>
          <button
            onClick={() => setCurrentExample('seo')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              currentExample === 'seo'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            SEO i Social Media
          </button>
        </div>
      </div>

      {currentExample === 'basic' && <BasicMetadataExample />}
      {currentExample === 'dynamic' && <DynamicMetadataExample />}
      {currentExample === 'seo' && <SEOMetadataExample />}

      <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Kluczowe cechy Document Metadata w React 19:</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-green-800 mb-2">✅ Automatyczne hoisting</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Elementy są automatycznie przenoszone do &lt;head&gt;</li>
              <li>• Nie trzeba używać React Helmet</li>
              <li>• Prostsze zarządzanie metadata</li>
              <li>• Lepsze SSR support</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">🎯 Deduplikacja</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• React automatycznie deduplikuje tagi</li>
              <li>• Ostatni renderowany tag wygrywa</li>
              <li>• Obsługa konfliktów między komponentami</li>
              <li>• Czyste i przewidywalne zachowanie</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 text-sm">
            <strong>Sprawdź Developer Tools:</strong> Otwórz zakładkę Elements w DevTools 
            i zobacz jak React automatycznie aktualizuje sekcję &lt;head&gt; dokumentu.
          </p>
        </div>
      </div>
    </div>
  )
}

function BasicMetadataExample() {
  return (
    <>
      {/* React 19: Te elementy automatycznie trafią do <head> */}
      <title>React 19 Playground - Podstawowe Metadata</title>
      <meta name="description" content="Przykład podstawowych meta tagów w React 19" />
      <meta name="keywords" content="React 19, metadata, frontend, JavaScript" />
      <meta name="author" content="React Developer" />
      <link rel="canonical" href="https://example.com/07-document-metadata" />
      
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Podstawowe Meta Tagi</h2>
        <p className="text-gray-600 mb-6">
          Ten przykład pokazuje jak React 19 automatycznie przenosi meta tagi do sekcji head dokumentu.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Renderowane elementy:</h3>
            <div className="space-y-2 text-sm font-mono">
              <div>&lt;title&gt;React 19 Playground - Podstawowe Metadata&lt;/title&gt;</div>
              <div>&lt;meta name="description" content="Przykład podstawowych meta tagów w React 19" /&gt;</div>
              <div>&lt;meta name="keywords" content="React 19, metadata, frontend, JavaScript" /&gt;</div>
              <div>&lt;meta name="author" content="React Developer" /&gt;</div>
              <div>&lt;link rel="canonical" href="https://example.com/07-document-metadata" /&gt;</div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <p className="text-blue-800 text-sm">
              <strong>Sprawdź w DevTools:</strong> Otwórz Developer Tools → Elements i sprawdź sekcję &lt;head&gt;. 
              Wszystkie powyższe tagi zostały automatycznie dodane przez React!
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

function DynamicMetadataExample() {
  const [pageType, setPageType] = useState<'homepage' | 'blog' | 'product'>('homepage')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const getMetadataForPage = (type: string) => {
    switch (type) {
      case 'homepage':
        return {
          title: 'Strona Główna - React 19 Playground',
          description: 'Witaj na stronie głównej naszego playground React 19',
          keywords: 'strona główna, react, typescript'
        }
      case 'blog':
        return {
          title: 'Blog - React 19 Playground',
          description: 'Najnowsze artykuły o React 19 i nowoczesnym froncie',
          keywords: 'blog, react 19, artykuły, frontend'
        }
      case 'product':
        return {
          title: 'Produkty - React 19 Playground',
          description: 'Nasze produkty wykorzystujące najnowsze technologie React',
          keywords: 'produkty, react components, biblioteka'
        }
      default:
        return {
          title: 'React 19 Playground',
          description: 'Playground dla React 19',
          keywords: 'react'
        }
    }
  }

  const metadata = getMetadataForPage(pageType)

  return (
    <>
      {/* Dynamiczne metadata - React automatycznie aktualizuje head */}
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="keywords" content={metadata.keywords} />
      <meta name="theme-color" content={theme === 'dark' ? '#1f2937' : '#ffffff'} />
      
      {/* Conditional metadata */}
      {pageType === 'blog' && (
        <>
          <meta property="article:author" content="React Team" />
          <meta property="article:published_time" content="2024-01-15T08:00:00.000Z" />
        </>
      )}

      {pageType === 'product' && (
        <>
          <meta property="product:price:amount" content="99.99" />
          <meta property="product:price:currency" content="PLN" />
        </>
      )}

      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Dynamiczne Meta Tagi</h2>
        <p className="text-gray-600 mb-6">
          Metadata aktualizują się w czasie rzeczywistym na podstawie stanu komponentu.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Typ strony:
            </label>
            <div className="flex space-x-4">
              {['homepage', 'blog', 'product'].map((type) => (
                <button
                  key={type}
                  onClick={() => setPageType(type as any)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pageType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {type === 'homepage' ? 'Strona główna' : 
                   type === 'blog' ? 'Blog' : 'Produkty'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motyw:
            </label>
            <div className="flex space-x-4">
              {['light', 'dark'].map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => setTheme(themeOption as any)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    theme === themeOption
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {themeOption === 'light' ? 'Jasny' : 'Ciemny'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Aktualne metadata:</h3>
            <div className="space-y-1 text-sm font-mono">
              <div><strong>title:</strong> {metadata.title}</div>
              <div><strong>description:</strong> {metadata.description}</div>
              <div><strong>keywords:</strong> {metadata.keywords}</div>
              <div><strong>theme-color:</strong> {theme === 'dark' ? '#1f2937' : '#ffffff'}</div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-md border border-green-200">
            <p className="text-green-800 text-sm">
              <strong>Zobacz w akcji:</strong> Zmień typ strony lub motyw i sprawdź w DevTools 
              jak React natychmiast aktualizuje metadata w sekcji &lt;head&gt;!
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

function SEOMetadataExample() {
  const [articleData, setArticleData] = useState({
    title: 'Przewodnik po React 19 - Najważniejsze nowości',
    description: 'Kompletny przewodnik po wszystkich nowościach w React 19, včetně useActionState, useFormStatus a nových funkcji ref.',
    author: 'Jan Kowalski',
    publishDate: '2024-01-15',
    image: 'https://example.com/react-19-guide.jpg',
    category: 'Frontend'
  })

  return (
    <>
      {/* SEO Meta Tags */}
      <title>{articleData.title}</title>
      <meta name="description" content={articleData.description} />
      
      {/* Open Graph Meta Tags dla social media */}
      <meta property="og:title" content={articleData.title} />
      <meta property="og:description" content={articleData.description} />
      <meta property="og:image" content={articleData.image} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content="https://example.com/07-document-metadata" />
      <meta property="og:site_name" content="React 19 Playground" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={articleData.title} />
      <meta name="twitter:description" content={articleData.description} />
      <meta name="twitter:image" content={articleData.image} />
      <meta name="twitter:creator" content="@reactdev" />
      
      {/* Article specific meta tags */}
      <meta property="article:author" content={articleData.author} />
      <meta property="article:published_time" content={`${articleData.publishDate}T08:00:00.000Z`} />
      <meta property="article:section" content={articleData.category} />
      <meta property="article:tag" content="React" />
      <meta property="article:tag" content="JavaScript" />
      <meta property="article:tag" content="Frontend" />
      
      {/* SEO enhancements */}
      <link rel="canonical" href="https://example.com/07-document-metadata" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Structured data hint */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": articleData.title,
          "description": articleData.description,
          "author": {
            "@type": "Person",
            "name": articleData.author
          },
          "datePublished": `${articleData.publishDate}T08:00:00.000Z`,
          "image": articleData.image
        })}
      </script>

      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">SEO i Social Media Metadata</h2>
        <p className="text-gray-600 mb-6">
          Kompletny przykład meta tagów dla SEO, Open Graph (Facebook) i Twitter Cards.
        </p>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tytuł artykułu:
              </label>
              <input
                type="text"
                value={articleData.title}
                onChange={(e) => setArticleData(prev => ({...prev, title: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autor:
              </label>
              <input
                type="text"
                value={articleData.author}
                onChange={(e) => setArticleData(prev => ({...prev, author: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opis:
            </label>
            <textarea
              value={articleData.description}
              onChange={(e) => setArticleData(prev => ({...prev, description: e.target.value}))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Generowane meta tagi:</h3>
            <div className="space-y-1 text-xs font-mono overflow-x-auto">
              <div className="text-green-700">&lt;!-- SEO podstawowe --&gt;</div>
              <div>&lt;title&gt;{articleData.title}&lt;/title&gt;</div>
              <div>&lt;meta name="description" content="{articleData.description.slice(0, 100)}..." /&gt;</div>
              
              <div className="text-blue-700 mt-2">&lt;!-- Open Graph (Facebook) --&gt;</div>
              <div>&lt;meta property="og:title" content="{articleData.title}" /&gt;</div>
              <div>&lt;meta property="og:type" content="article" /&gt;</div>
              
              <div className="text-purple-700 mt-2">&lt;!-- Twitter Card --&gt;</div>
              <div>&lt;meta name="twitter:card" content="summary_large_image" /&gt;</div>
              <div>&lt;meta name="twitter:creator" content="@reactdev" /&gt;</div>
              
              <div className="text-orange-700 mt-2">&lt;!-- JSON-LD structured data --&gt;</div>
              <div>&lt;script type="application/ld+json"&gt;...&lt;/script&gt;</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
              <h4 className="font-semibold text-blue-800 text-sm mb-1">Facebook Share</h4>
              <p className="text-xs text-blue-700">Open Graph tagi zapewniają prawidłowe wyświetlanie w social media</p>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
              <h4 className="font-semibold text-purple-800 text-sm mb-1">Twitter Card</h4>
              <p className="text-xs text-purple-700">Dedicated tagi dla lepszego wyświetlania na Twitterze</p>
            </div>
            
            <div className="bg-green-50 p-3 rounded-md border border-green-200">
              <h4 className="font-semibold text-green-800 text-sm mb-1">Google SEO</h4>
              <p className="text-xs text-green-700">Structured data i canonicale URL dla lepszego SEO</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}