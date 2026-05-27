package com.example.english_learning_app.publicapi;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PublicApiService {

    private static final Logger logger = LoggerFactory.getLogger(PublicApiService.class);
    private final RestTemplate restTemplate;

    // In-memory cache for Quote of the Day (12 hours)
    private QuoteResponse cachedQuote;
    private LocalDateTime quoteCacheExpiry;

    public PublicApiService() {
        this.restTemplate = new RestTemplate();
    }

    public QuoteResponse getDailyQuote() {
        // Return cached quote if valid
        if (cachedQuote != null && quoteCacheExpiry != null && LocalDateTime.now().isBefore(quoteCacheExpiry)) {
            logger.info("Returning cached daily quote.");
            return cachedQuote;
        }

        try {
            logger.info("Fetching new quote of the day from ZenQuotes API...");
            String url = "https://zenquotes.io/api/random";
            // ZenQuotes returns an array of objects
            Map<String, Object>[] response = restTemplate.getForObject(url, Map[].class);

            if (response != null && response.length > 0) {
                Map<String, Object> quoteMap = response[0];
                String content = (String) quoteMap.get("q");
                String author = (String) quoteMap.get("a");

                cachedQuote = new QuoteResponse(content, author);
                quoteCacheExpiry = LocalDateTime.now().plusHours(12);
                
                logger.info("Successfully fetched and cached new daily quote.");
                return cachedQuote;
            }
        } catch (Exception e) {
            logger.error("Failed to fetch quote from ZenQuotes API. Using fallback.", e);
        }

        // Fallback quote in case of failures
        return new QuoteResponse(
            "Learning is a treasure that will follow its owner everywhere.",
            "Chinese Proverb"
        );
    }

    public JokeResponse getDailyJoke() {
        try {
            logger.info("Fetching daily joke from JokeAPI...");
            String url = "https://v2.jokeapi.dev/joke/Any?type=twopart";
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response != null && Boolean.FALSE.equals(response.get("error"))) {
                String setup = (String) response.get("setup");
                String punchline = (String) response.get("delivery");

                if (setup != null && punchline != null) {
                    logger.info("Successfully fetched daily joke.");
                    return new JokeResponse(setup, punchline);
                }
            }
        } catch (Exception e) {
            logger.error("Failed to fetch joke from JokeAPI. Using fallback.", e);
        }

        // Fallback joke in case of failures
        return new JokeResponse(
            "Why do programmers prefer dark mode?",
            "Because light attracts bugs."
        );
    }

    public List<TriviaResponse> getTriviaQuestions(String difficulty) {
        try {
            logger.info("Fetching trivia questions from Open Trivia DB...");
            String diffParam = (difficulty != null && !difficulty.isEmpty()) ? "&difficulty=" + difficulty : "";
            String url = "https://opentdb.com/api.php?amount=5&type=multiple" + diffParam;
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && (response.get("response_code") != null && Integer.valueOf(0).equals(response.get("response_code")))) {
                List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
                List<TriviaResponse> triviaList = new ArrayList<>();
                
                for (Map<String, Object> item : results) {
                    String question = unescapeHtml((String) item.get("question"));
                    String correctAnswer = unescapeHtml((String) item.get("correct_answer"));
                    List<String> incorrectAnswers = (List<String>) item.get("incorrect_answers");
                    
                    List<String> answers = new ArrayList<>();
                    answers.add(correctAnswer);
                    for (String inc : incorrectAnswers) {
                        answers.add(unescapeHtml(inc));
                    }
                    Collections.shuffle(answers); // Shuffle answers
                    
                    triviaList.add(new TriviaResponse(
                        question,
                        correctAnswer,
                        answers,
                        (String) item.get("difficulty"),
                        (String) item.get("category")
                    ));
                }
                return triviaList;
            }
        } catch (Exception e) {
            logger.error("Failed to fetch trivia from Open Trivia DB. Using fallbacks.", e);
        }
        
        // Fallback questions in case of failures
        return List.of(
            new TriviaResponse(
                "Which programming language is known as the language of the web?",
                "JavaScript",
                List.of("JavaScript", "Python", "C++", "Java"),
                "easy",
                "Computers"
            ),
            new TriviaResponse(
                "Who is the author of 'Romeo and Juliet'?",
                "William Shakespeare",
                List.of("William Shakespeare", "Charles Dickens", "Leo Tolstoy", "Mark Twain"),
                "easy",
                "Literature"
            )
        );
    }

    public List<NewsResponse> getNewsArticles() {
        try {
            logger.info("Fetching English news articles from static NewsAPI clone...");
            String url = "https://saurav.tech/NewsAPI/top-headlines/category/general/us.json";
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && "ok".equals(response.get("status"))) {
                List<Map<String, Object>> articles = (List<Map<String, Object>>) response.get("articles");
                List<NewsResponse> newsList = new ArrayList<>();
                
                // Limit to top 10 articles for efficiency
                int count = 0;
                for (Map<String, Object> item : articles) {
                    if (count >= 10) break;
                    
                    String title = (String) item.get("title");
                    String description = (String) item.get("description");
                    String content = (String) item.get("content");
                    String urlLink = (String) item.get("url");
                    String urlToImage = (String) item.get("urlToImage");
                    String publishedAt = (String) item.get("publishedAt");
                    
                    // Filter out removed or empty articles
                    if (title == null || title.contains("[Removed]") || title.isEmpty()) {
                        continue;
                    }
                    
                    // Clean content: remove [xxx chars] suffix often present in NewsAPI articles
                    if (content != null) {
                        content = content.replaceAll("\\[\\+\\d+\\s+chars\\]", "");
                    } else {
                        content = description != null ? description : "Click the link below to read the full article.";
                    }
                    
                    String readability = calculateReadability(content);
                    
                    newsList.add(new NewsResponse(
                        title,
                        description != null ? description : "",
                        content,
                        urlLink != null ? urlLink : "",
                        urlToImage != null ? urlToImage : "",
                        publishedAt != null ? publishedAt : "",
                        readability
                    ));
                    count++;
                }
                return newsList;
            }
        } catch (Exception e) {
            logger.error("Failed to fetch news from Saurav NewsAPI. Using fallbacks.", e);
        }
        
        // Fallback news in case of failures
        return List.of(
            new NewsResponse(
                "Artificial Intelligence Revolution in Modern Education",
                "How AI systems are transforming the personalized language learning landscape.",
                "Artificial intelligence is rapidly reshaping how students learn languages. With adaptive tutoring systems, interactive AI conversation partners, and instant grammar analytics, learners can progress at their own speed. Experts believe that AI will not replace human teachers but will serve as incredibly powerful assistants that customize learning materials for every individual student's needs, maximizing study outcomes.",
                "https://example.com/ai-education",
                "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600",
                "2026-05-27T08:00:00Z",
                "Medium"
            ),
            new NewsResponse(
                "The Benefits of Learning a Second Language for Brain Health",
                "Bilingualism is scientifically proven to boost cognitive reserves and delay dementia.",
                "A series of recent scientific studies have confirmed that learning a second language is one of the most effective exercises for maintaining brain health. Researchers found that individuals who speak more than one language possess higher levels of cognitive flexibility and executive control. Furthermore, bilingualism has been shown to delay the onset of dementia symptoms by an average of four to five years, providing significant lifelong neurological protection.",
                "https://example.com/bilingual-benefits",
                "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=600",
                "2026-05-27T09:30:00Z",
                "Hard"
            )
        );
    }

    public List<RadioResponse> getEnglishRadioStations() {
        try {
            logger.info("Fetching English radio stations from Radio Browser API...");
            String url = "https://de1.api.radio-browser.info/json/stations/bytag/english?limit=15&order=votes&reverse=true";
            
            Map<String, Object>[] response = restTemplate.getForObject(url, Map[].class);
            if (response != null && response.length > 0) {
                List<RadioResponse> radioList = new ArrayList<>();
                int count = 0;
                for (Map<String, Object> item : response) {
                    if (count >= 10) break;
                    
                    String name = (String) item.get("name");
                    String streamUrl = (String) item.get("url_resolved");
                    if (streamUrl == null || streamUrl.isEmpty()) {
                        streamUrl = (String) item.get("url");
                    }
                    String favicon = (String) item.get("favicon");
                    String country = (String) item.get("countrycode");
                    String tags = (String) item.get("tags");
                    
                    // Filter out stations with bad stream URLs
                    if (name == null || name.trim().isEmpty() || streamUrl == null || streamUrl.isEmpty() || !streamUrl.startsWith("http")) {
                        continue;
                    }
                    
                    radioList.add(new RadioResponse(
                        name.trim(),
                        streamUrl.trim(),
                        favicon != null ? favicon.trim() : "",
                        country != null ? country.trim() : "US",
                        tags != null ? tags.trim() : "general"
                    ));
                    count++;
                }
                return radioList;
            }
        } catch (Exception e) {
            logger.error("Failed to fetch radio from Radio Browser API. Using fallbacks.", e);
        }
        
        // Fallback radio stations in case of failures
        return List.of(
            new RadioResponse(
                "BBC Radio 4",
                "http://stream.live.vc.bbc.co.uk/bbc_radio_fourfm",
                "https://images.unsplash.com/photo-1571330735066-03add07b6b8f?q=80&w=100",
                "GB",
                "news,talk"
            ),
            new RadioResponse(
                "BBC Radio 1",
                "http://stream.live.vc.bbc.co.uk/bbc_radio_one",
                "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=100",
                "GB",
                "pop,top40"
            ),
            new RadioResponse(
                "NPR News",
                "https://npr-ice.streamguys1.com/live.mp3",
                "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=100",
                "US",
                "news,public"
            )
        );
    }

    private String calculateReadability(String content) {
        if (content == null || content.isEmpty()) return "Easy";
        String[] words = content.split("\\s+");
        if (words.length < 100) return "Easy";
        if (words.length < 200) return "Medium";
        return "Hard";
    }

    private String unescapeHtml(String input) {
        if (input == null) return null;
        return input.replace("&quot;", "\"")
                    .replace("&#039;", "'")
                    .replace("&amp;", "&")
                    .replace("&lt;", "<")
                    .replace("&gt;", ">")
                    .replace("&deg;", "°")
                    .replace("&rsquo;", "'")
                    .replace("&ldquo;", "\"")
                    .replace("&rdquo;", "\"");
    }
}
