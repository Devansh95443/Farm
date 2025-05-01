import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import re
import json
import os

# Download required NLTK data
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger')

class FarmingAssistant:
    def __init__(self):
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
        self.vectorizer = TfidfVectorizer()
        self.knowledge_base = self._load_knowledge_base()
        self._prepare_knowledge_base()

    def _load_knowledge_base(self):
        # Load farming knowledge base from JSON file
        knowledge_base_path = os.path.join(os.path.dirname(__file__), 'farming_knowledge.json')
        try:
            with open(knowledge_base_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            # Default knowledge base if file doesn't exist
            return {
                "crops": {
                    "wheat": "Wheat requires well-drained soil and moderate temperatures. Plant in early spring or fall.",
                    "rice": "Rice needs flooded fields and warm temperatures. Best grown in tropical regions.",
                    "corn": "Corn requires full sun and fertile soil. Plant after the last frost in spring."
                },
                "pests": {
                    "aphids": "Aphids can be controlled using natural predators like ladybugs or insecticidal soap.",
                    "caterpillars": "Handpick caterpillars or use Bacillus thuringiensis (Bt) for control.",
                    "weevils": "Use crop rotation and proper storage techniques to prevent weevil infestations."
                },
                "diseases": {
                    "rust": "Rust can be prevented with proper spacing and fungicide application.",
                    "blight": "Remove infected plants and use resistant varieties to control blight.",
                    "mildew": "Improve air circulation and use fungicides to prevent mildew."
                },
                "soil": {
                    "ph": "Most crops prefer soil pH between 6.0 and 7.0. Test soil regularly.",
                    "nutrients": "Essential nutrients include nitrogen, phosphorus, and potassium.",
                    "organic_matter": "Add compost to improve soil structure and fertility."
                }
            }

    def _prepare_knowledge_base(self):
        # Convert knowledge base into a format suitable for vectorization
        self.questions = []
        self.answers = []
        self.categories = []

        for category, items in self.knowledge_base.items():
            for key, value in items.items():
                self.questions.append(f"{category} {key}")
                self.answers.append(value)
                self.categories.append(category)

        # Vectorize the questions
        self.question_vectors = self.vectorizer.fit_transform(self.questions)

    def _preprocess_text(self, text):
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters
        text = re.sub(r'[^\w\s]', '', text)
        
        # Tokenize
        tokens = word_tokenize(text)
        
        # Remove stopwords and lemmatize
        tokens = [self.lemmatizer.lemmatize(token) for token in tokens if token not in self.stop_words]
        
        return ' '.join(tokens)

    def _get_most_similar_question(self, query):
        # Preprocess the query
        processed_query = self._preprocess_text(query)
        
        # Vectorize the query
        query_vector = self.vectorizer.transform([processed_query])
        
        # Calculate similarity scores
        similarity_scores = cosine_similarity(query_vector, self.question_vectors)
        
        # Get the index of the most similar question
        most_similar_idx = np.argmax(similarity_scores)
        
        return most_similar_idx, similarity_scores[0][most_similar_idx]

    def get_response(self, query):
        # Get the most similar question and its similarity score
        most_similar_idx, similarity_score = self._get_most_similar_question(query)
        
        # If similarity score is too low, return a default response
        if similarity_score < 0.3:
            return {
                "response": "I'm not sure about that specific farming query. Could you please provide more details?",
                "confidence": similarity_score,
                "category": "unknown"
            }
        
        # Return the response with metadata
        return {
            "response": self.answers[most_similar_idx],
            "confidence": similarity_score,
            "category": self.categories[most_similar_idx]
        }

    def add_knowledge(self, category, key, value):
        """Add new knowledge to the assistant"""
        if category not in self.knowledge_base:
            self.knowledge_base[category] = {}
        
        self.knowledge_base[category][key] = value
        self._prepare_knowledge_base()  # Rebuild the vectorized knowledge base

    def save_knowledge_base(self):
        """Save the current knowledge base to a JSON file"""
        knowledge_base_path = os.path.join(os.path.dirname(__file__), 'farming_knowledge.json')
        with open(knowledge_base_path, 'w', encoding='utf-8') as f:
            json.dump(self.knowledge_base, f, indent=4)

# Example usage
if __name__ == "__main__":
    assistant = FarmingAssistant()
    
    # Test queries
    test_queries = [
        "How do I grow wheat?",
        "What's the best way to control aphids?",
        "How can I improve my soil pH?",
        "Tell me about rice cultivation"
    ]
    
    for query in test_queries:
        response = assistant.get_response(query)
        print(f"\nQuery: {query}")
        print(f"Response: {response['response']}")
        print(f"Confidence: {response['confidence']:.2f}")
        print(f"Category: {response['category']}") 