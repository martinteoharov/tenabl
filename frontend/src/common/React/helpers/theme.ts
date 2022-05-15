export type Theme = "light" | "dark";

export const setTheme = (theme: Theme) => {
    const style = getComputedStyle(document.body);
    if(theme === "light") {
        document.documentElement.style.setProperty('--primaryBackgroundColor', style.getPropertyValue("--light-bg-1"));
        document.documentElement.style.setProperty('--secondaryBackgroundColor', style.getPropertyValue("--light-bg-2"));
        document.documentElement.style.setProperty('--primaryColor', style.getPropertyValue("--light-1"));
    } else {
        document.documentElement.style.setProperty('--primaryBackgroundColor', style.getPropertyValue("--dark-bg-1"));
        document.documentElement.style.setProperty('--secondaryBackgroundColor', style.getPropertyValue("--dark-bg-2"));
        document.documentElement.style.setProperty('--primaryColor', style.getPropertyValue("--dark-1"));
    }

    localStorage.setItem("theme", theme);
};
