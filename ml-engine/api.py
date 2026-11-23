from fastapi import FastAPI
from pydantic import BaseModel
import json
import random
import hashlib
import math

app = FastAPI(title="SRL AI Engine")

class SessionRequest(BaseModel):
    planned_duration: int
    time_of_day: int
    streak_days: int
    subject: str

@app.post("/predict_session")
def predict_session(req: SessionRequest):

    risk_score = (req.planned_duration / 180.0) * 0.5
    if req.time_of_day >= 22 or req.time_of_day <= 4:
        risk_score += 0.3
    if req.streak_days < 3:
        risk_score += 0.2
        
    is_high_risk = risk_score > 0.6
    
    if is_high_risk:
        if req.time_of_day >= 22 or req.time_of_day <= 4:
            nudge = f"Our model detects a {int(risk_score*100)}% risk of fatigue for a {req.planned_duration}m late-night session. Try a 25-minute Pomodoro instead to protect your sleep."
        elif req.planned_duration > 90:
            nudge = f"Our model detects a {int(risk_score*100)}% burnout risk for this long block. Consider splitting this {req.subject} session into two parts with a 15-minute break."
        else:
            nudge = f"You are building a new habit! Our model suggests shortening this {req.subject} session slightly to ensure you don't burn out."
    else:
        nudge = f"Optimal conditions detected! Your {req.planned_duration}m {req.subject} plan aligns perfectly with your current stamina. Go for it!"
        
    return {"risk_probability": risk_score, "is_high_risk": bool(is_high_risk), "nudge": nudge}

behavior_centroids = []
try:
    with open("models/behavior_centroids.json", "r") as f:
        behavior_centroids = json.load(f)
except Exception as e:
    print(f"Error loading behavior models: {e}. Please run train_student_behavior.py first.")

class UserBehaviorRequest(BaseModel):
    goal_completion_rate: float
    time_estimation_ratio: float
    avg_distractions: float

@app.post("/analyze_behavior")
def analyze_behavior(req: UserBehaviorRequest):
    point = [req.goal_completion_rate, req.time_estimation_ratio, req.avg_distractions]
    
    distances = []
    for c in behavior_centroids:
        c_point = c["features"]

        dist = math.sqrt(sum((p - c_val) ** 2 for p, c_val in zip(point, c_point)))
        distances.append(dist)
    
    cluster_id = distances.index(min(distances))
    matched_cluster = behavior_centroids[cluster_id]
    
    return {
        "cluster_id": cluster_id,
        "persona": matched_cluster["label"],
        "daily_suggestion": matched_cluster["suggestion"]
    }

class GoalBreakdownRequest(BaseModel):
    title: str
    subject: str
    duration: int

@app.post("/generate_breakdown")
def generate_breakdown(req: GoalBreakdownRequest):
    d = req.duration
    t = req.title if req.title else "this topic"
    s = req.subject if req.subject else "the material"
    
    seed_str = req.title + req.subject
    seed_val = int(hashlib.md5(seed_str.encode('utf-8')).hexdigest()[:8], 16)
    local_rand = random.Random(seed_val)
    
    templates = [
        [
            f"0-{int(d*0.15)}m: Brainstorm everything you already know about '{t}'",
            f"{int(d*0.15)}-{int(d*0.6)}m: Deep dive: Read and annotate core concepts of {s}",
            f"{int(d*0.6)}-{int(d*0.8)}m: Write down 3 key takeaways without looking at your notes",
            f"{int(d*0.8)}-{d}m: Review and plan your next session"
        ],
        [
            f"0-{int(d*0.1)}m: Set up your workspace specifically for '{t}'",
            f"{int(d*0.1)}-{int(d*0.5)}m: Attempt 2-3 practice problems related to {s}",
            f"{int(d*0.5)}-{int(d*0.85)}m: Analyze mistakes and re-read the theory",
            f"{int(d*0.85)}-{d}m: Do one final problem perfectly"
        ],
        [
            f"0-{int(d*0.25)}m: Read through '{t}'",
            f"{int(d*0.25)}-{int(d*0.6)}m: The Feynman Technique: Explain {s} out loud to an imaginary student",
            f"{int(d*0.6)}-{int(d*0.9)}m: Identify gaps where you stumbled and review them",
            f"{int(d*0.9)}-{d}m: Final quick review"
        ],
        [
            f"0-{int(d*0.2)}m: Outline the structure of '{t}'",
            f"{int(d*0.2)}-{int(d*0.7)}m: Focused Pomodoro block: Work through the {s} material",
            f"{int(d*0.7)}-{int(d*0.85)}m: Create a visual mind-map connecting the concepts",
            f"{int(d*0.85)}-{d}m: Cool down and save your notes"
        ]
    ]
    
    subtasks = local_rand.choice(templates)
    return {"breakdown": json.dumps(subtasks)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
