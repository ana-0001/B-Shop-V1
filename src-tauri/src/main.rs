//! main.rs — نقطة الدخول لتطبيق سطح المكتب B-Shop (Tauri).
//! الواجهة بتشتغل من نسخة Nuxt SPA المولّدة، والنافذة بتفتح على مقاس 1440x900.

// منع ظهور نافذة الكونسول في نسخة الويندوز النهائية
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("فشل تشغيل تطبيق B-Shop");
}
