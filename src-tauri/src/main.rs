// Prevents additional console window on Windows in release
#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct SearchRequest {
    query: String,
}

#[derive(Serialize, Deserialize)]
struct SearchResponse {
    category: String,
    cleaned_query: String,
}

#[tauri::command]
fn classify_intent(query: String) -> SearchResponse {
    let is_url = query.starts_with("http://")
        || query.starts_with("https://")
        || (query.contains(".") && !query.contains(" "));

    if is_url {
        SearchResponse {
            category: "url".to_string(),
            cleaned_query: query,
        }
    } else {
        SearchResponse {
            category: "search".to_string(),
            cleaned_query: query,
        }
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![classify_intent])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
