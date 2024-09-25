import { Controller, Get, Post, Render, Query, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { quotes } from './quotes'; // Idézetek importálása

@Controller()
export class AppController {
  constructor() {}

  @Get('/authorRandomForm')
  @Render('authorRandom')
  getAuthorRandomForm() {
    return {};
  }

  @Post('/authorRandom')
  @Render('authorRandom')
  searchQuoteByAuthor(@Body() body: { author: string }) {
    try {
      const author = body.author;

      if (!author) {
        return {
          searchAuthor: null,
          quotes: [],
        };
      }

      // Szűrés a szerző alapján
      const filteredQuotes = quotes.quotes.filter(quote =>
        quote.author.toLowerCase() === author.toLowerCase()
      );

      return {
        searchAuthor: author,
        quotes: filteredQuotes,
      };
    } catch (error) {
      console.error('Error occurred in searchQuoteByAuthor:', error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('quotes')
  @Render('quotes')
  getQuotes() {
    try {
      return {
        quotes: quotes.quotes
      };
    } catch (error) {
      console.error('Error occurred in getQuotes:', error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('randomQuote')
  @Render('randomQuote')
  getRandomQuote() {
    try {
      const quoteArray = quotes.quotes as { id: number; quote: string; author: string }[];
      const randomIndex = Math.floor(Math.random() * quoteArray.length);
      const randomQuote = quoteArray[randomIndex];
      return {
        quote: randomQuote
      };
    } catch (error) {
      console.error('Error occurred in getRandomQuote:', error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('topAuthors')
  @Render('topAuthors')
  getTopAuthors() {
    try {
      const quoteArray = quotes.quotes as { id: number; quote: string; author: string }[];
      const authorCounts = quoteArray.reduce((acc, quote) => {
        acc[quote.author] = (acc[quote.author] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const sortedAuthors = Object.entries(authorCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .map(([author, count]) => ({ author, count }));
      return {
        authors: sortedAuthors
      };
    } catch (error) {
      console.error('Error occurred in getTopAuthors:', error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('quotes/:id')
  @Render('idkereses')
  getQuoteById(@Param('id') id: string) {
    try {
      const quote = quotes.quotes.find(q => q.id === parseInt(id));
      if (!quote) {
        return {
          message: { quote: 'Idézet nem található', author: '' }
        };
      }
      return {
        message: quote
      };
    } catch (error) {
      console.error('Error occurred in getQuoteById:', error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('deleteQuote/:id')
  @Render('deleteResult')
  deleteQuote(@Param('id') id: string) {
    try {
      const index = quotes.quotes.findIndex(q => q.id === parseInt(id));
      if (index !== -1) {
        quotes.quotes.splice(index, 1);
        return {
          message: 'Sikeres törlés'
        };
      } else {
        return {
          message: 'Ismeretlen idézet'
        };
      }
    } catch (error) {
      console.error('Error occurred in deleteQuote:', error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/search')
  @Render('searchResults')
  searchQuotes(@Query('text') text: string) {
    try {
      if (!text) {
        return { quotes: [], searchText: text };
      }
      const filteredQuotes = quotes.quotes.filter(quote =>
        quote.quote.toLowerCase().includes(text.toLowerCase())
      );
      return {
        quotes: filteredQuotes,
        searchText: text
      };
    } catch (error) {
      console.error('Error occurred in searchQuotes:', error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
