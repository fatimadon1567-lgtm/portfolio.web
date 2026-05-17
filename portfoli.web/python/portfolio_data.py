"""
portfolio_data.py
Generates a JSON data file with your portfolio information.
Run this script to update portfolio_data.json used by the site.

Usage:
    python python/portfolio_data.py
"""

import json
import os
from datetime import datetime

# ============================================================
#  EDIT THIS SECTION WITH YOUR REAL INFORMATION
# ============================================================

PORTFOLIO = {
    "personal": {
        "name": "Your Full Name",
        "nickname": "YourName",
        "title": "Computer Science Student",
        "university": "Your University Name",
        "degree": "BSc Computer Science",
        "year": 2,
        "location": "Your City, Country",
        "email": "yourname@email.com",
        "github": "https://github.com/yourusername",
        "linkedin": "https://linkedin.com/in/yourusername",
        "bio": (
            "I'm a passionate Computer Science student with a love for building "
            "creative and functional web applications. I enjoy turning complex "
            "problems into simple, beautiful, and intuitive solutions."
        ),
        "available_for": "Internship",
        "years_coding": 2
    },

    "skills": [
        {"name": "Python",     "icon": "fab fa-python",     "level": 80},
        {"name": "JavaScript", "icon": "fab fa-js",         "level": 75},
        {"name": "PHP",        "icon": "fab fa-php",        "level": 65},
        {"name": "HTML5",      "icon": "fab fa-html5",      "level": 90},
        {"name": "CSS3",       "icon": "fab fa-css3-alt",   "level": 85},
        {"name": "MySQL",      "icon": "fas fa-database",   "level": 60},
    ],

    "projects": [
        {
            "title": "Personal Blog Website",
            "description": "A responsive blog platform with dark mode, search functionality, and dynamic content loading.",
            "tags": ["HTML", "CSS", "JS"],
            "category": "web",
            "icon": "fas fa-globe",
            "live_url": "#",
            "github_url": "#"
        },
        {
            "title": "Student Grade Predictor",
            "description": "A machine learning model that predicts student grades based on study habits and attendance data.",
            "tags": ["Python", "Flask", "ML"],
            "category": "python",
            "icon": "fab fa-python",
            "live_url": "#",
            "github_url": "#"
        },
        {
            "title": "Student Management System",
            "description": "A full CRUD web app for managing student records, grades, and attendance with admin dashboard.",
            "tags": ["PHP", "MySQL", "Bootstrap"],
            "category": "php",
            "icon": "fab fa-php",
            "live_url": "#",
            "github_url": "#"
        },
        {
            "title": "Data Dashboard",
            "description": "Interactive data visualization dashboard powered by Python backend and Chart.js frontend.",
            "tags": ["Python", "JS", "Chart.js"],
            "category": "web python",
            "icon": "fas fa-chart-line",
            "live_url": "#",
            "github_url": "#"
        },
        {
            "title": "E-Commerce UI",
            "description": "A modern e-commerce front-end with product filtering, cart functionality, and smooth animations.",
            "tags": ["HTML", "CSS", "JS"],
            "category": "web",
            "icon": "fas fa-shopping-cart",
            "live_url": "#",
            "github_url": "#"
        },
        {
            "title": "Chatbot Assistant",
            "description": "A simple AI chatbot built with Python and NLP libraries that answers FAQs for a university portal.",
            "tags": ["Python", "NLP", "API"],
            "category": "python",
            "icon": "fas fa-robot",
            "live_url": "#",
            "github_url": "#"
        }
    ],

    "education": [
        {
            "degree": "BSc Computer Science",
            "institution": "Your University Name",
            "period": "2023 – Present",
            "current": True
        },
        {
            "degree": "High School Diploma",
            "institution": "Your High School Name",
            "period": "2020 – 2023",
            "current": False
        }
    ],

    "interests": [
        {"title": "Web Development",    "icon": "fas fa-globe",      "desc": "Building responsive and interactive web experiences"},
        {"title": "AI & Machine Learning","icon": "fas fa-brain",    "desc": "Exploring intelligent systems with Python"},
        {"title": "3D Graphics",        "icon": "fas fa-cube",       "desc": "Creating immersive 3D experiences on the web"},
        {"title": "Cybersecurity",      "icon": "fas fa-shield-alt", "desc": "Learning about secure coding and ethical hacking"}
    ],

    "stats": {
        "projects": len([p for p in [] if True]) or 10,  # auto-count or set manually
        "technologies": 6,
        "years_coding": 2
    },

    "meta": {
        "generated_at": datetime.now().isoformat(),
        "version": "1.0.0"
    }
}

# Auto-count projects
PORTFOLIO["stats"]["projects"] = len(PORTFOLIO["projects"])

# ============================================================
#  Output JSON
# ============================================================

def main():
    output_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "portfolio_data.json"
    )

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(PORTFOLIO, f, indent=2, ensure_ascii=False)

    print(f"✅ portfolio_data.json generated at: {output_path}")
    print(f"   Name:     {PORTFOLIO['personal']['name']}")
    print(f"   Projects: {PORTFOLIO['stats']['projects']}")
    print(f"   Skills:   {len(PORTFOLIO['skills'])}")


if __name__ == "__main__":
    main()
