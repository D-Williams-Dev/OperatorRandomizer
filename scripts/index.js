async function fetchOperators(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Successfully loaded operators from: ${filePath}`, data);
        return data;
    } catch (error) {
        console.error(`Could not fetch data from ${filePath}:`, error);
        return [];
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    allAttackers = await fetchOperators('/OperatorRandomizerWebsite/attackers.json');
    allDefenders = await fetchOperators('/OperatorRandomizerWebsite/defenders.json');
});

let allAttackers = [];
let allDefenders = [];

const operatorDisplaySelectors = [
    '.operatorOne',
    '.operatorTwo',
    '.operatorThree',
    '.operatorFour',
    '.operatorFive',
];

function updateOperatorDisplay(elementSelector, operator) {
    const operatorBox = document.querySelector(elementSelector);

    if (!operatorBox) {
        console.warn(`Operator box with selector ${elementSelector} not found!`);
        return;
    }

    const img = operatorBox.querySelector('img');
    //May add <p>name</p> later

    if (img) {
        if (operator) {
            img.src = operator.iconPath;
            img.alt =  operator.name;
        } else {
            img.src = '';
            img.alt = 'No Operator';
        }
    }
}

function randomizeUniqueOperators(operatorList, count, targetSelectors) {
    if (operatorList.length < count) {
        console.warn(`Not enough unique operators (${operatorList.length}) to select ${count}. Displaying available ones`);

        for (let i = 0; i < targetSelectors.length; i++) {
            updateOperatorDisplay(targetSelectors[i], i < operatorList.length ? operatorList[i] : null);
        }
        return;
    }

    const shuffledList = [...operatorList].sort(() => Math.random() - 0.5);
    const selectedOperators = shuffledList.slice(0, count);

    for (let i = 0; i < count; i++) {
        updateOperatorDisplay(targetSelectors[i], selectedOperators[i]);
    }
}


function randomizeAttackers() {
    randomizeUniqueOperators(allAttackers, 5, operatorDisplaySelectors);
}
function randomizeDefenders() {
    randomizeUniqueOperators(allDefenders, 5, operatorDisplaySelectors)
}
