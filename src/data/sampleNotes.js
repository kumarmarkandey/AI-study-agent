export const INITIAL_NOTES = [
  {
    id: 'note-1',
    title: 'Transformer Architectures & Attention Mechanisms',
    subject: 'Computer Science',
    tags: ['AI', 'Transformers', 'NLP', 'Math'],
    updatedAt: '2026-08-12T14:30:00Z',
    content: `# Transformer Architectures & Attention Mechanisms

The Transformer architecture introduced in *"Attention Is All You Need"* (Vaswani et al., 2017) revolutionized modern Artificial Intelligence by replacing recurrent networks (RNNs) with **Self-Attention Mechanisms**.

## Scaled Dot-Product Attention

Given Query matrix $Q$, Key matrix $K$, and Value matrix $V$:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

### Key Parameters:
- **$Q$ (Query)**: Vector representation of the target word searching for context.
- **$K$ (Key)**: Vector representations of all words in the input sequence.
- **$V$ (Value)**: Actual feature payload vectors.
- **$\\sqrt{d_k}$**: Scaling factor to prevent large dot-product values from pushing softmax into extremely small gradient regions.

---

## Multi-Head Attention

Instead of performing a single attention function, Multi-Head Attention projects Queries, Keys, and Values $h$ times into lower-dimensional subspaces:

$$\\text{MultiHead}(Q,K,V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h)W^O$$

where $\\text{head}_i = \\text{Attention}(QW_i^Q, KW_i^K, VW_i^V)$.

\`\`\`python
import torch
import torch.nn as nn
import math

class ScaledDotProductAttention(nn.Module):
    def __init__(self, d_k):
        super().__init__()
        self.d_k = d_k

    def forward(self, Q, K, V, mask=None):
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.d_k)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        attn_weights = torch.softmax(scores, dim=-1)
        output = torch.matmul(attn_weights, V)
        return output, attn_weights
\`\`\`

## Key Takeaways
1. Enables parallel computation across entire sequence during training.
2. Captures long-range dependencies regardless of physical distance in text.
3. Forms the backbone of LLMs like GPT-4, Gemini, and Claude.
`
  },
  {
    id: 'note-2',
    title: 'Thermodynamics & Carnot Cycle Efficiency',
    subject: 'Physics',
    tags: ['Physics', 'Thermodynamics', 'Energy'],
    updatedAt: '2026-08-10T09:15:00Z',
    content: `# Thermodynamics & Carnot Cycle Efficiency

The **Carnot Cycle** is an idealized thermodynamic cycle operating between two thermal reservoirs ($T_H$ and $T_C$). It establishes the maximum theoretical efficiency limit for heat engines.

## Four Reversible Processes
1. **Isothermal Expansion**: Absorbs heat $Q_H$ from hot reservoir at temperature $T_H$.
2. **Adiabatic Expansion**: Temperature drops from $T_H$ to $T_C$ without heat transfer.
3. **Isothermal Compression**: Rejects heat $Q_C$ into cold sink at temperature $T_C$.
4. **Adiabatic Compression**: Work done on gas increases temperature back from $T_C$ to $T_H$.

---

## Efficiency Formula

The efficiency $\\eta$ of a heat engine is defined as:

$$\\eta = \\frac{W}{Q_H} = 1 - \\frac{Q_C}{Q_H}$$

For a Carnot Engine, efficiency depends solely on absolute temperatures (in Kelvin):

$$\\eta_{\\text{Carnot}} = 1 - \\frac{T_C}{T_H}$$

### Key Insights:
- $\\eta$ approaches $100\\%$ only if $T_C \\to 0\\text{ K}$ (Absolute Zero, which is physically unattainable according to 3rd Law of Thermodynamics).
- No actual heat engine can exceed Carnot Efficiency operating between the same temperature pair.
`
  },
  {
    id: 'note-3',
    title: 'DNA Replication & Proofreading Machinery',
    subject: 'Biology',
    tags: ['Genetics', 'Enzymes', 'Biochemistry'],
    updatedAt: '2026-08-07T11:45:00Z',
    content: `# DNA Replication & Proofreading Machinery

DNA replication is a **semi-conservative** process where each of the two original parental strands serves as a template for synthesis of a new complementary strand.

## Key Enzymes & Roles
- **Helicase**: Unwinds the double helix at replication origin.
- **Single-Strand Binding Proteins (SSBs)**: Stabilize unwound single-stranded DNA.
- **Primase**: Synthesizes short RNA primers required by DNA Polymerase.
- **DNA Polymerase III**: Synthesizes new DNA strand in $5' \\to 3'$ direction.
- **DNA Ligase**: Joins Okazaki fragments on lagging strand.

## Fidelity & Proofreading
DNA Polymerase III possesses $3' \\to 5'$ **exonuclease activity** for immediate proofreading, maintaining mutation rates below 1 error per $10^9$ base pairs.
`
  }
];
