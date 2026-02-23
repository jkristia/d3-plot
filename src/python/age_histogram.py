# script to generate 100k age values from a normal distribution with mean 35 and standard deviation 12
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

age_field = "age"
bin_size = 5


def generate_data() -> pd.DataFrame:
    np.random.seed(42)

    normal_dist_mean = 39  # For U.S., use: mean ≈ 39, SD ≈ 14–16
    normal_dist_std = 15
    samples = 100_000
    ages = np.random.normal(loc=normal_dist_mean, scale=normal_dist_std, size=samples)
    ages = np.clip(ages, 0, 100)  # keep ages in a realistic range

    df = pd.DataFrame({age_field: ages})
    return df


def generate_hist_bins(df: pd.DataFrame, bin_size: int = 5) -> pd.DataFrame:
    bins = list(range(0, 105 + bin_size, bin_size))  # 0–5, 5–10, ..., 95–100, 100–105
    labels = [f"{b}-{b+bin_size}" for b in bins[:-1]]
    df["age_bin"] = pd.cut(df[age_field], bins=bins, labels=labels, right=False)
    histogram = df["age_bin"].value_counts().sort_index().reset_index()
    histogram.columns = ["age_bin", "count"]
    return histogram


def save_as_ts_datafile(df: pd.DataFrame, filename: str) -> None:
    # save as json to typescript for use
    # include const hist_data = { <json data> }
    with open(filename, "w") as f:
        f.write("export const hist_data = ")
        df.to_json(f, orient="records", indent=2)
        f.write(";\n")


data = generate_data()
histogram = generate_hist_bins(data, bin_size=bin_size)
print(histogram)

save_as_ts_datafile(histogram, "age_data_bins.ts")
histogram.plot(kind="bar", x="age_bin", y="count", legend=False)
plt.show()  # type: ignore
