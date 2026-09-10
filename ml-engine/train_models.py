import random
import json
import math
import os

def generate_and_train():
    print("Training custom ML models from scratch in pure Python...")
    random.seed(42)

    data = []

    for _ in range(150):
        data.append([random.gauss(120, 20), random.gauss(2, 1), random.gauss(4.5, 0.5)])

    for _ in range(150):
        data.append([random.gauss(25, 10), random.gauss(6, 2), random.gauss(3, 1)])

    for _ in range(200):
        data.append([random.gauss(45, 10), random.gauss(1, 0.5), random.gauss(3, 1)])

    centroids = random.sample(data, 3)
    
    for iteration in range(10):
        clusters = {0: [], 1: [], 2: []}
        for point in data:

            distances = []
            for i, c in enumerate(centroids):
                dist = math.sqrt(sum((p - c_val) ** 2 for p, c_val in zip(point, c)))
                distances.append(dist)
            closest_idx = distances.index(min(distances))
            clusters[closest_idx].append(point)

        new_centroids = []
        for i in range(3):
            if clusters[i]:
                new_c = []
                for dim in range(3):
                    avg = sum(p[dim] for p in clusters[i]) / len(clusters[i])
                    new_c.append(avg)
                new_centroids.append(new_c)
            else:
                new_centroids.append(centroids[i])
        centroids = new_centroids

    os.makedirs('models', exist_ok=True)
    with open('models/centroids.json', 'w') as f:
        json.dump(centroids, f)
        
    print("Models trained and saved successfully in /models directory.")

if __name__ == "__main__":
    generate_and_train()
