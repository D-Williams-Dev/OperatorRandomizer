// 1. Declare global variables at the top.
// This ensures they are available before any functions try to use them.
let allAttackers = [];
let allDefenders = [];

const operatorDisplaySelectors = [
    '.operatorOne',
    '.operatorTwo',
    '.operatorThree',
    '.operatorFour',
    '.operatorFive'
];

// --- Core Utility Functions ---

/**
 * Fetches JSON data from a given file path.
 * @param {string} filePath - The path to the JSON file.
 * @returns {Promise<Array>} A promise that resolves to an array of operator data.
 */
async function fetchOperators(filePath) {
    console.log(`Attempting to fetch from: ${filePath}`); // Added for debugging
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            // Throw error with status for better debugging
            throw new Error(`HTTP error! status: ${response.status} for ${filePath}`);
        }
        const data = await response.json();
        console.log(`Successfully loaded operators from: ${filePath}`, data);
        return data;
    } catch (error) {
        console.error(`Could not fetch data from ${filePath}:`, error);
        return [];
    }
}

/**
 * Updates a single operator display box with the provided operator data.
 * @param {string} elementSelector - The CSS selector for the operator box (e.g., '.operatorOne').
 * @param {Object|null} operator - The operator object to display, or null to clear/default.
 */
function updateOperatorDisplay(elementSelector, operator) {
    const operatorBox = document.querySelector(elementSelector);

    if (!operatorBox) {
        console.warn(`Operator box with selector ${elementSelector} not found!`);
        return;
    }

    const img = operatorBox.querySelector('img');

    if (img) {
        if (operator) {
            img.src = operator.iconPath;
            img.alt = operator.name;
        } else {
            img.src = '';
            img.alt = 'No Operator'; // Or a default placeholder image path
        }
    }
}

/**
 * Shuffles an array randomly using the Fisher-Yates (Knuth) algorithm.
 * This is generally more robust than sort(() => Math.random() - 0.5) for randomness.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} A new, shuffled array.
 */
function shuffleArray(array) {
    const newArray = [...array]; // Create a shallow copy to avoid modifying the original
    let currentIndex = newArray.length;
    let randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [newArray[currentIndex], newArray[randomIndex]] = [
            newArray[randomIndex], newArray[currentIndex]];
    }
    return newArray;
}


/**
 * Randomly selects 'count' unique operators from a given list and updates the display.
 * @param {Array} operatorList - The array of operators (attackers or defenders) to choose from.
 * @param {number} count - The number of unique operators to select.
 * @param {Array<string>} targetSelectors - An array of CSS selectors for the display boxes.
 */
function randomizeUniqueOperators(operatorList, count, targetSelectors) {
    if (!operatorList || operatorList.length === 0) {
        console.error("Operator list is empty or not loaded.");
        // Clear all displays if list is empty
        targetSelectors.forEach(selector => updateOperatorDisplay(selector, null));
        return;
    }

    if (operatorList.length < count) {
        console.warn(`Not enough unique operators (${operatorList.length}) to select ${count}. Displaying available ones.`);

        // Display all available operators and clear the rest
        for (let i = 0; i < targetSelectors.length; i++) {
            updateOperatorDisplay(targetSelectors[i], i < operatorList.length ? operatorList[i] : null);
        }
        return;
    }

    const shuffledList = shuffleArray(operatorList);
    const selectedOperators = shuffledList.slice(0, count);

    for (let i = 0; i < count; i++) {
        updateOperatorDisplay(targetSelectors[i], selectedOperators[i]);
    }
}

// --- Event Handlers for Buttons (called by onclick in HTML) ---

function randomizeAttackers() {
    randomizeUniqueOperators(allAttackers, 5, operatorDisplaySelectors);
}

function randomizeDefenders() {
    randomizeUniqueOperators(allDefenders, 5, operatorDisplaySelectors);
}

// --- Initialization on Page Load ---

document.addEventListener('DOMContentLoaded', async () => {
    allAttackers = await fetchOperators('/OperatorRandomizer/attackers.json');
    allDefenders = await fetchOperators('/OperatorRandomizer/defenders.json');
    randomizeAttackers();
});