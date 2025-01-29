export async function getWeatherData(location: string) {
    const response = await fetch(`/api/weather?location=${location}`);
    const data = await response.json();
    return data;
}

export async function getSearchData(query: string) {
    const response = await fetch(`/api/search?query=${query}`);
    const data = await response.json();
    const formattedResults = data.slice(0, 3).map((item: any) => ({
        title: item.title,
        url: item.url,
        snippet: item.content ? item.content.substring(0, 200) + "..." : "No content available",
    }));
    console.log("Tavily Search Results:", formattedResults);

    return formattedResults;
}

export function saveMemory(key: string, value: string) {
    const memory = JSON.parse(localStorage.getItem("memory") || "{}");
    memory[key] = value;
    localStorage.setItem("memory", JSON.stringify(memory));
}

export function loadMemory() {
    return JSON.parse(localStorage.getItem("memory") || "{}");
}

export function resetMemory() {
    localStorage.removeItem("memory");
    return {};
}