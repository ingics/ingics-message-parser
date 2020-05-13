module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es6': true,
        'node': true,
        'jest/globals': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:jest/recommended',
        'plugin:jest/style'
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 11
    },
    'plugins': ['jest'],
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ]
    }
};
