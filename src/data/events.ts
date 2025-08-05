import { AstronomicalEvent } from '../types/Event';

const eventCache = new Map<string, AstronomicalEvent[]>();

const formatDateForAPOD = (date: Date): string => {
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
};

const isFutureDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const inputDate = new Date(date);
  inputDate.setHours(0, 0, 0, 0);

  return inputDate > today;
};

const scrapeAPODPage = async (dateCode: string): Promise<any> => {
  const url = `https://apod.nasa.gov/apod/ap${dateCode}.html`;
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const { contents } = await response.json();
    if (!contents) throw new Error('No content received');

    const parser = new DOMParser();
    const doc = parser.parseFromString(contents, 'text/html');
    
    const center = doc.querySelector('body > center:first-child');
    if (!center) throw new Error('No center tag found');

    const img = center.querySelector('p img');
    if (!img) throw new Error('No image found in center tag');

    let imageUrl = img.getAttribute('src');
    if (!imageUrl) throw new Error('No src attribute found on image');
    
    if (!imageUrl.startsWith('http')) {
      imageUrl = imageUrl.replace(/^\//, '');
      imageUrl = `https://apod.nasa.gov/apod/${imageUrl}`;
    }

    let hdUrl = null;
    const parentLink = center.querySelector('p a');
    if (parentLink) {
      const href = parentLink.getAttribute('href');
      if (href && !href.startsWith('#')) {
        hdUrl = href.startsWith('http') ? href : `https://apod.nasa.gov/apod/${href}`;
      }
    }

    let title = '';
    const titleElement = center.querySelector('b:first-child') || 
                        doc.querySelector('title');
    if (titleElement) {
      title = titleElement.textContent?.trim().replace(/^APOD:\s*/i, '') || '';
    }

    let explanation = '';
    const paragraphs = Array.from(doc.querySelectorAll('body > p'));
    for (const p of paragraphs) {
      const text = p.textContent?.trim() || '';
      if (text.toLowerCase().includes('explanation') || explanation === '') {
        explanation = text.replace(/^explanation:/i, '').trim();
      }
    }

    let copyright = '';
    const copyrightElement = center.querySelector('a') || 
                           center.querySelector('i');
    if (copyrightElement) {
      copyright = copyrightElement.textContent?.trim() || '';
    }

    const credits = extractCreditsFromSecondCenter(doc);

    return {
      title: title || 'Astronomy Picture of the Day',
      explanation: explanation || 'No explanation available',
      url: imageUrl,
      hdurl: hdUrl,
      media_type: 'image',
      copyrightHtml: credits || undefined,
      date: `20${dateCode.slice(0,2)}-${dateCode.slice(2,4)}-${dateCode.slice(4,6)}`
    };

  } catch (error) {
    console.error(`Failed to scrape APOD for ${dateCode}:`, error);
    throw error;
  }
};

const getYearsToFetch = (selectedDate: Date): number[] => {
  const currentYear = new Date().getFullYear();
  const selectedYear = selectedDate.getFullYear();
  
  const years = new Set<number>(); 

  if (isFutureDate(selectedDate)) {
    years.add(2024); 
  } else {
    years.add(2025);
  }
  
  const endYear = isFutureDate(selectedDate) ? 2024 : currentYear;
  for (let year = 1996; year <= endYear; year++) {
    years.add(year);
  }
  
  return Array.from(years).sort((a, b) => b - a); 
};

const extractCreditsFromSecondCenter = (doc: Document): string => {
  const allCenters = doc.querySelectorAll('body > center');
  if (allCenters.length < 2) return ''; 
  
  const secondCenter = allCenters[1];
  const creditNodes = Array.from(secondCenter.childNodes);
  
  let credits = '';
  let skipFirstBold = true; 

  creditNodes.forEach(node => {
    if (skipFirstBold && node.nodeName === 'B') {
      skipFirstBold = false;
      return;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      credits += node.textContent?.trim();
      if (node.textContent?.trim()) {
        credits += ' '; 
      }
    }
    else if (node.nodeName === 'BR') {
      credits += '\n';
    }
    else if (node.nodeName === 'A') {
      const anchor = node as HTMLAnchorElement;
      if (anchor.href && anchor.href.startsWith('http')) {
        credits += `<b><a href="${anchor.href}" target="_blank" rel="noopener noreferrer" class="underline">${anchor.textContent?.trim()}</a></b>`;
      } else {
        credits += anchor.textContent?.trim();
      }
    }
    else if (node.nodeName === 'B' || node.nodeName === 'I') {
      credits += node.textContent?.trim();
    }
  });

  return credits.trim();
};


export const getEventsForDate = async (selectedDate: Date): Promise<AstronomicalEvent[]> => {
  const cacheKey = `${selectedDate.getMonth()}-${selectedDate.getDate()}`;
  
  if (eventCache.has(cacheKey)) {
    return eventCache.get(cacheKey)!;
  }

  const yearsToFetch = getYearsToFetch(selectedDate);
  const events: AstronomicalEvent[] = [];

  const mandatoryYear = isFutureDate(selectedDate) ? 2024 : 2025;

  const batchSize = 5;
  for (let i = 0; i < yearsToFetch.length; i += batchSize) {
    const batch = yearsToFetch.slice(i, i + batchSize);
    const batchPromises = batch.map(year => {
      const targetDate = new Date(year, selectedDate.getMonth(), selectedDate.getDate());
      const dateCode = formatDateForAPOD(targetDate);
      
      return scrapeAPODPage(dateCode)
        .then(data => ({
          id: `apod-${year}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`,
          title: data.title,
          date: targetDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
          year: year,
          description: data.explanation,
          type: 'discovery',
          source: `https://apod.nasa.gov/apod/ap${dateCode}.html`,
          image: data.url,
          hdurl: data.hdurl || undefined,
          details: `NASA Astronomy Picture of the Day from ${year}`,
          copyrightHtml: data.copyrightHtml || undefined
        }))
        .catch(error => {
          console.warn(`Failed to fetch APOD for ${year}:`, error);
          return null;
        });
    });

    const batchResults = await Promise.all(batchPromises);
    const successfulResults = batchResults.filter(event => event !== null) as AstronomicalEvent[];
    events.push(...successfulResults);

    if (i + batchSize < yearsToFetch.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  if (!events.some(event => event.year === mandatoryYear)) {
    console.log(`Retrying mandatory year ${mandatoryYear}...`);
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries && !events.some(event => event.year === mandatoryYear)) {
      try {
        const targetDate = new Date(mandatoryYear, selectedDate.getMonth(), selectedDate.getDate());
        const dateCode = formatDateForAPOD(targetDate);
        const data = await scrapeAPODPage(dateCode);
        
        events.unshift({ 
          id: `apod-${mandatoryYear}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`,
          title: data.title,
          date: targetDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
          year: mandatoryYear,
          description: data.explanation,
          type: 'discovery',
          source: `https://apod.nasa.gov/apod/ap${dateCode}.html`,
          image: data.url,
          hdurl: data.hdurl || undefined,
          details: `NASA Astronomy Picture of the Day from ${mandatoryYear}`,
          copyrightHtml: data.copyrightHtml || undefined
        });
      } catch (error) {
        console.warn(`Retry ${retryCount + 1} failed for mandatory year ${mandatoryYear}:`, error);
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 2000)); 
      }
    }
  }

  if (events.length === 0) {
    throw new Error('Could not fetch any APOD data');
  }


  events.sort((a, b) => b.year - a.year);


  if (events.length > 0) {
    eventCache.set(cacheKey, events);
  }

  return events;
};

export const clearEventCache = (): void => {
  eventCache.clear();
};

export const preloadEventsForDate = (selectedDate: Date): void => {
  setTimeout(() => getEventsForDate(selectedDate), 100);
};