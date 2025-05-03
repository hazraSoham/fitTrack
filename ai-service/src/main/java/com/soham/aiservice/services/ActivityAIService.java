package com.soham.aiservice.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.soham.aiservice.models.Activity;
import com.soham.aiservice.models.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {
    private final GeminiService geminiService;


    public Recommendation generateRecommendation(Activity activity) {
        String prompt = createRecommendationPrompt(activity);
        String aiResponse = geminiService.getAnswer(prompt);
        log.info("Response from AI : {}", aiResponse);

        return processAIResponse(activity, aiResponse);
    }

    private String createRecommendationPrompt(Activity activity) {
        return String.format("""
                        Analyze the data and provide fitness recommendation in the format provided:
                        {
                            "analysis": {
                                "overall" : "Overall analysis here",
                                "pace" : "Pace analysis here",
                                "heartRate" : "HeartRate analysis here",
                                "caloriesBurned" : "CaloriesBurned analysis here"
                            },
                            "improvements" : [
                                {
                                    "area": "Area of improvements",
                                    "recommendation": "Recommendation of improvements",
                                }
                            ],
                            "suggestions" : [
                                {
                                    "workout" : "Workout name",
                                    description" : "Workout description"
                                }
                            ],
                            "safety" : [
                                "Safety point1", "Safety point2", "Safety point3", "Safety point4"
                            ]
                        }
                        Analyze this activity:
                        Activity type: %s
                        Duration: %d minutes
                        Calories Burned: %d
                        Additional Metrics: %s
                        Provide detailed analysis based the activity provided, focus on performance improvements,
                        next workout suggestions and safety guidelines.
                        Ensure the output follows the exact json format provided.
                        """,
                activity.getActivityType(),
                activity.getDuration(),
                activity.getCaloriesBurnt(),
                activity.getAdditionalMetrics());
    }

    private Recommendation processAIResponse(Activity activity, String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            JsonNode textNode = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            String jsonTextNode = textNode.asText()
                    .replaceAll("```json\\n", "")
                    .replaceAll("//n```", "")
                    .trim();

            log.info("Parsed Response from AI : {}", jsonTextNode);

            JsonNode analysisJson = mapper.readTree(jsonTextNode);

            JsonNode analysisNode = analysisJson.path("analysis");
            String fullAnalysis = addSection(analysisNode, "overall", "Overall") +
                    addSection(analysisNode, "pace", "Pace") +
                    addSection(analysisNode, "heartRate", "Heart Rate") +
                    addSection(analysisNode, "caloriesBurned", "Calories Burned");

            JsonNode improvementNodes = analysisJson.path("improvements");
            List<String> improvements = new ArrayList<>();
            if (improvementNodes.isArray()) {
                improvementNodes.forEach(improvement -> {
                    String sb = addSection(improvement, "area", "Area") +
                            addSection(improvement, "recommendation", "Recommendation");
                    improvements.add(sb);
                });
            } else {
                log.info("No improvements found");
            }

            JsonNode suggestionsNodes = analysisJson.path("suggestions");
            List<String> suggestions = new ArrayList<>();
            if (suggestionsNodes.isArray()) {
                suggestionsNodes.forEach(suggestion -> {
                    String sb = addSection(suggestion, "workout", "Workout") +
                            addSection(suggestion, "description", "Description");
                    suggestions.add(sb);
                });
            } else {
                log.info("No specific suggestions provided");
            }

            JsonNode safetyNodes = analysisJson.path("safety");
            List<String> safety = new ArrayList<>();
            if (safetyNodes.isArray()) {
                safetyNodes.forEach(s -> safety.add(s.asText()));
            } else {
                log.info("No specific safety provided");
            }


            return Recommendation.builder()
                    .activityId(activity.getId())
                    .activityType(activity.getActivityType())
                    .userId(activity.getUserId())
                    .recommendation(fullAnalysis)
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safety(safety).build();

        } catch (Exception e) {
            log.error(e.getMessage());
        }

        return defaultRecommendation(activity);
    }

    private String addSection(JsonNode jsonNode, String nodeName, String prefix) {
        return jsonNode.has(nodeName) ? prefix + ":" + jsonNode.get(nodeName).asText() + "\n" : "";
    }

    private Recommendation defaultRecommendation(Activity activity) {
        return Recommendation.builder()
                .activityId(activity.getId())
                .activityType(activity.getActivityType())
                .userId(activity.getUserId())
                .recommendation("Unable to generate recommendations")
                .improvements(Collections.singletonList("Continue with your current routine"))
                .suggestions(Collections.singletonList("Consider consulting a professional"))
                .safety(Arrays.asList(
                        "Always warm up before exercise",
                        "Stay hydrated",
                        "Listen to your body"))
                .build();
    }
}
