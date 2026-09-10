import random
import csv
import json
import math
import os

def generate_behavior_data():
    print("Generating 120 student profiles based on goal progress and time tracking...")
    random.seed(42)
    
    students = []

    for i in range(1, 31):
        comp_rate = round(random.uniform(0.80, 1.00), 2)
        time_ratio = round(random.uniform(0.90, 1.10), 2) 
        distractions = round(random.uniform(0.0, 1.5), 1)
        label = "Efficient Learner"
        nudge = "You are pacing perfectly. Your time estimates are highly accurate. Keep up the exact same strategy today!"
        students.append([i, comp_rate, time_ratio, distractions, label, nudge])

    for i in range(31, 61):
        comp_rate = round(random.uniform(0.20, 0.55), 2)
        time_ratio = round(random.uniform(0.40, 0.75), 2)
        distractions = round(random.uniform(1.0, 3.0), 1)
        label = "Over-Planner"
        nudge = "You might be scheduling too much. Try the 'Rule of 3' today: pick only 3 non-negotiable goals to prevent feeling overwhelmed."
        students.append([i, comp_rate, time_ratio, distractions, label, nudge])

    for i in range(61, 91):
        comp_rate = round(random.uniform(0.60, 0.90), 2)
        time_ratio = round(random.uniform(1.30, 2.00), 2)
        distractions = round(random.uniform(1.0, 2.5), 1)
        label = "Under-Estimator"
        nudge = "Your tasks are taking longer than planned. Pad today's time estimates by 50% to reduce time-anxiety and stay on track."
        students.append([i, comp_rate, time_ratio, distractions, label, nudge])

    for i in range(91, 121):
        comp_rate = round(random.uniform(0.15, 0.50), 2)
        time_ratio = round(random.uniform(1.20, 1.80), 2)
        distractions = round(random.uniform(4.0, 8.0), 1)
        label = "Distracted Learner"
        nudge = "High fragmentation detected in your recent tasks. Turn on 'Do Not Disturb' and attempt a strict 25-minute focused sprint."
        students.append([i, comp_rate, time_ratio, distractions, label, nudge])

    csv_file = 'student_behavior_data.csv'
    with open(csv_file, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['student_id', 'goal_completion_rate', 'time_estimation_ratio', 'avg_distractions', 'behavior_label', 'daily_suggestion'])
        writer.writerows(students)
        
    print(f"Generated {len(students)} rows of data and saved to {csv_file}")

    centroids = []

    for start_idx in [0, 30, 60, 90]:
        cluster_points = students[start_idx:start_idx+30]
        avg_comp = sum(p[1] for p in cluster_points) / 30.0
        avg_time = sum(p[2] for p in cluster_points) / 30.0
        avg_dist = sum(p[3] for p in cluster_points) / 30.0
        label = cluster_points[0][4]
        nudge = cluster_points[0][5]
        centroids.append({
            "features": [avg_comp, avg_time, avg_dist],
            "label": label,
            "suggestion": nudge
        })

    os.makedirs('models', exist_ok=True)
    with open('models/behavior_centroids.json', 'w') as f:
        json.dump(centroids, f)
        
    print("Extracted centroids and saved to models/behavior_centroids.json")

if __name__ == "__main__":
    generate_behavior_data()
