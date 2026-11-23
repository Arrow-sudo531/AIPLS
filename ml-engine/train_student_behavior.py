import urllib.request
import csv
import io
import json
import math
import random
import os

SHEET_ID = '1XP7esofKaRxOQnLNNE3lqYha65hpDJnVjnuYQDH-oMM'
SOURCE_LABEL = 'real_survey_2026'

def fetch_survey_data():
    url = f'https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    content = urllib.request.urlopen(req, timeout=15).read().decode('utf-8')
    return list(csv.reader(io.StringIO(content)))[1:]

def map_completion(val):
    m = {'None': 0.0, 'A few': 0.20, 'About half': 0.50, 'Most': 0.75, 'All': 1.0}
    return m.get(val.strip(), 0.5)

def map_consistency(val):
    m = {'Not at all': 1.80, 'Slightly': 1.40, 'Moderately': 1.10, 'Very': 0.95, 'Extremely': 0.85}
    return m.get(val.strip(), 1.10)

def map_distractions(val):
    v = val.strip()
    if v == '0': return 0.0
    if '1' in v and '2' in v: return 1.5
    if '3' in v and '4' in v: return 3.5
    if '5' in v and '6' in v: return 5.5
    if '7' in v: return 7.5
    return 3.5

def assign_persona(comp, time_ratio, dist_val):
    if comp >= 0.65 and dist_val <= 2.0:
        return ('Efficient Learner',
                'You are pacing perfectly. Your completion rate is high and distractions are minimal. Keep up this disciplined routine!')
    elif dist_val >= 4.5:
        return ('Distracted Learner',
                'High distraction frequency is significantly lowering your completion rate. Try a strict 25-minute Pomodoro sprint with phone on Do Not Disturb mode.')
    elif time_ratio >= 1.30:
        return ('Under-Estimator',
                'Your sessions frequently run over planned time. Pad your time estimates by 40% and break goals into smaller, more achievable milestones.')
    else:
        return ('Over-Planner',
                'You set many goals but complete fewer than expected. Apply the Rule of 3: pick your 3 most critical goals and focus only on those today.')

def euclidean_dist(a, b):
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))

def cluster_mean(pts):
    n = len(pts)
    return [sum(p[k] for p in pts) / n for k in range(len(pts[0]))]

def kmeans(records, k=4, max_iter=300):
    random.seed(42)
    centroids = [list(records[i][1:]) for i in random.sample(range(len(records)), k)]
    for iteration in range(max_iter):
        clusters = [[] for _ in range(k)]
        for r in records:
            pt = r[1:]
            nearest = min(range(k), key=lambda ki: euclidean_dist(pt, centroids[ki]))
            clusters[nearest].append(pt)
        new_centroids = [cluster_mean(c) if c else centroids[ki] for ki, c in enumerate(clusters)]
        if new_centroids == centroids:
            print(f'K-Means converged at iteration {iteration + 1}')
            break
        centroids = new_centroids
    return centroids, clusters

def train_on_real_data():
    print('Fetching real survey data from Google Sheets...')
    raw = fetch_survey_data()

    records = []
    for i, row in enumerate(raw):
        if len(row) < 14:
            continue
        try:
            comp  = map_completion(row[4])
            trat  = map_consistency(row[13])
            distr = map_distractions(row[6])
            records.append([i + 1, comp, trat, distr])
        except Exception:
            continue

    print(f'Mapped {len(records)} real survey responses to feature vectors')

    centroids, clusters = kmeans(records, k=4)

    os.makedirs('models', exist_ok=True)

    output_centroids = []
    seen_labels = {}
    for ki in range(4):
        c = centroids[ki]
        label, suggestion = assign_persona(c[0], c[1], c[2])
        if label in seen_labels:
            alts = ['Over-Planner', 'Under-Estimator', 'Distracted Learner', 'Efficient Learner']
            for alt in alts:
                if alt not in seen_labels:
                    label = alt
                    suggestion = {
                        'Over-Planner': 'You set many goals but complete fewer than expected. Apply the Rule of 3: pick your 3 most critical goals and focus only on those today.',
                        'Under-Estimator': 'Your sessions frequently run over planned time. Pad your time estimates by 40% and break goals into smaller milestones.',
                        'Distracted Learner': 'High distraction frequency is significantly lowering your completion rate. Try a strict 25-minute Pomodoro sprint with phone on Do Not Disturb.',
                        'Efficient Learner': 'You are pacing perfectly. Your completion rate is high and distractions are minimal. Keep up this disciplined routine!'
                    }[label]
                    break
        seen_labels[label] = True
        output_centroids.append({
            'features': [round(c[0], 4), round(c[1], 4), round(c[2], 4)],
            'label': label,
            'suggestion': suggestion
        })
        print(f'Cluster {ki}: comp={c[0]:.3f}, time={c[1]:.3f}, dist={c[2]:.3f}, size={len(clusters[ki])} -> {label}')

    with open('models/behavior_centroids.json', 'w') as f:
        json.dump(output_centroids, f, indent=2)
    print('Saved distinct centroids to models/behavior_centroids.json')

    csv_file = 'student_behavior_data.csv'
    with open(csv_file, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['student_id', 'goal_completion_rate', 'time_estimation_ratio',
                         'avg_distractions', 'behavior_label', 'source'])
        for r in records:
            label, _ = assign_persona(r[1], r[2], r[3])
            writer.writerow([r[0], r[1], r[2], r[3], label, SOURCE_LABEL])
    print(f'Saved {len(records)} real survey rows to {csv_file}')
    print('All done. Each cluster now has a distinct persona label.')

if __name__ == '__main__':
    train_on_real_data()
