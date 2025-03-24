import { parseQuestions } from '../questions';

describe('parseQuestions', () => {
  it('should parse markdown content correctly', () => {
    const markdown = `
###### 1. What's the output?

\`\`\`javascript
const a = {};
const b = { key: 'b' };
const c = { key: 'c' };

a[b] = 123;
a[c] = 456;

console.log(a[b]);
\`\`\`

- A: 123
- B: 456
- C: undefined
- D: ReferenceError

#### Answer: B

<details>
<summary>Explanation</summary>
When you use an object as a key in another object, JavaScript converts it to a string using the toString() method. In this case, both b and c objects are converted to "[object Object]". So a[b] and a[c] are actually setting the same property.

The last value set (456) is what gets stored, so a[b] returns 456.
</details>
`;

    const questions = parseQuestions(markdown);

    expect(questions).toHaveLength(1);
    expect(questions[0]).toEqual({
      id: 'q1',
      question: "What's the output?",
      options: ['123', '456', 'undefined', 'ReferenceError'],
      correctAnswer: 1,
      explanation:
        'When you use an object as a key in another object, JavaScript converts it to a string using the toString() method. In this case, both b and c objects are converted to "[object Object]". So a[b] and a[c] are actually setting the same property.\nThe last value set (456) is what gets stored, so a[b] returns 456.',
      category: 'JavaScript',
      difficulty: 'medium',
      codeSnippet: `const a = {};
const b = { key: 'b' };
const c = { key: 'c' };

a[b] = 123;
a[c] = 456;

console.log(a[b]);`,
    });
  });

  it('should handle multiple questions', () => {
    const markdown = `
###### 1. First question?

- A: Option 1
- B: Option 2

#### Answer: A

<details>
<summary>Explanation</summary>
First explanation
</details>

###### 2. Second question?

- A: Option 1
- B: Option 2

#### Answer: B

<details>
<summary>Explanation</summary>
Second explanation
</details>
`;

    const questions = parseQuestions(markdown);

    expect(questions).toHaveLength(2);
    expect(questions[0].id).toBe('q1');
    expect(questions[1].id).toBe('q2');
  });

  it('should handle questions without code snippets', () => {
    const markdown = `
###### 1. Simple question?

- A: Option 1
- B: Option 2

#### Answer: A

<details>
<summary>Explanation</summary>
Simple explanation
</details>
`;

    const questions = parseQuestions(markdown);

    expect(questions).toHaveLength(1);
    expect(questions[0].codeSnippet).toBe('');
  });
});
