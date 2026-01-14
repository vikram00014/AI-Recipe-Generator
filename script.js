// DOM Elements
const ingredientsInput = document.getElementById('ingredients');
const cuisineSelect = document.getElementById('cuisine');
const mealTypeSelect = document.getElementById('mealType');
const generateBtn = document.getElementById('generateBtn');
const newRecipeBtn = document.getElementById('newRecipeBtn');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const resultsDiv = document.getElementById('results');
const recipeContent = document.getElementById('recipeContent');

// Event Listeners
generateBtn.addEventListener('click', generateRecipe);
newRecipeBtn.addEventListener('click', resetForm);

// Enter key support in textarea
ingredientsInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        generateRecipe();
    }
});

// Main function to generate recipe
async function generateRecipe() {
    const ingredients = ingredientsInput.value.trim();
    
    if (!ingredients) {
        showError('Please enter at least one ingredient!');
        return;
    }

    // Show loading state
    showLoading();
    
    try {
        const recipe = await fetchRecipeFromGemini(ingredients);
        displayRecipe(recipe);
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Failed to generate recipe. Please try again.');
    }
}

// Fetch recipe from Gemini API
async function fetchRecipeFromGemini(ingredients) {
    const cuisine = cuisineSelect.value;
    const mealType = mealTypeSelect.value;
    
    // Build the prompt
    let prompt = `Create a detailed, delicious recipe using these ingredients: ${ingredients}.`;
    
    if (cuisine) {
        prompt += ` The recipe should be ${cuisine} cuisine.`;
    }
    
    if (mealType) {
        prompt += ` This should be a ${mealType} recipe.`;
    }
    
    prompt += `

Please provide the recipe in the following JSON format:
{
    "recipeName": "Name of the dish",
    "prepTime": "Preparation time",
    "cookTime": "Cooking time",
    "servings": "Number of servings",
    "difficulty": "Easy/Medium/Hard",
    "ingredients": ["ingredient 1", "ingredient 2", ...],
    "instructions": ["step 1", "step 2", ...],
    "tips": "Any cooking tips or variations (optional)"
}

Make sure the recipe is practical, delicious, and creative. Focus on making the most of the available ingredients.`;

    const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response from API');
    }

    const text = data.candidates[0].content.parts[0].text;
    
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Could not parse recipe data');
    }
    
    const recipe = JSON.parse(jsonMatch[0]);
    return recipe;
}

// Display the recipe
function displayRecipe(recipe) {
    const metaItems = [
        { icon: '⏱️', label: 'Prep', value: recipe.prepTime },
        { icon: '🔥', label: 'Cook', value: recipe.cookTime },
        { icon: '🍽️', label: 'Servings', value: recipe.servings },
        { icon: '📊', label: 'Difficulty', value: recipe.difficulty }
    ];

    const metaHTML = metaItems
        .map(item => `
            <div class="meta-item">
                <span>${item.icon}</span>
                <span>${item.label}: ${item.value}</span>
            </div>
        `)
        .join('');

    const ingredientsHTML = recipe.ingredients
        .map(ingredient => `<li>${ingredient}</li>`)
        .join('');

    const instructionsHTML = recipe.instructions
        .map((instruction, index) => `
            <li>
                <div class="step-number">${index + 1}</div>
                <div class="step-text">${instruction}</div>
            </li>
        `)
        .join('');

    const tipsHTML = recipe.tips ? `
        <div class="recipe-section">
            <h3>💡 Pro Tips</h3>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 10px;">
                ${recipe.tips}
            </div>
        </div>
    ` : '';

    recipeContent.innerHTML = `
        <div class="recipe-card">
            <h2 class="recipe-title">${recipe.recipeName}</h2>
            <div class="recipe-meta">
                ${metaHTML}
            </div>
            
            <div class="recipe-section">
                <h3>🛒 Ingredients</h3>
                <ul>${ingredientsHTML}</ul>
            </div>
            
            <div class="recipe-section">
                <h3>👨‍🍳 Instructions</h3>
                <ul>${instructionsHTML}</ul>
            </div>
            
            ${tipsHTML}
        </div>
    `;

    hideLoading();
    hideError();
    resultsDiv.classList.remove('hidden');
}

// UI State Management
function showLoading() {
    generateBtn.disabled = true;
    loadingDiv.classList.remove('hidden');
    errorDiv.classList.add('hidden');
    resultsDiv.classList.add('hidden');
}

function hideLoading() {
    generateBtn.disabled = false;
    loadingDiv.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorDiv.classList.remove('hidden');
    hideLoading();
}

function hideError() {
    errorDiv.classList.add('hidden');
}

function resetForm() {
    resultsDiv.classList.add('hidden');
    ingredientsInput.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initial focus
ingredientsInput.focus();
