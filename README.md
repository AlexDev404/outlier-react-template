# React Template for Outlier AI Coding Tasks

A modern React TypeScript template pre-configured with essential tools and libraries commonly needed for Outlier AI coding assessments and tasks.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download this template**
   ```bash
   git clone <repository-url>
   cd react-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   The app will automatically open at `http://localhost:3000`

## 📦 What's Included

This template comes pre-configured with:

### Core Technologies
- **React 18** - Latest React with hooks and concurrent features
- **TypeScript** - For type safety and better development experience
- **Vite** - Fast build tool and development server

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui components** - Pre-configured component system
- **Lucide React** - Beautiful icon library
- **React Icons** - Additional icon collection
- **Radix UI** - Accessible UI primitives

### Development Tools
- **ESLint** - Code linting and style enforcement
- **PostCSS** - CSS processing
- **Path aliases** - Clean imports with `@/` prefix

## 🛠 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
react-template/
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── components.json      # shadcn/ui configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies and scripts
```

## 🎯 Perfect for Outlier AI Tasks

This template is specifically designed for common Outlier AI coding scenarios:

### Frontend Development Tasks
- **Component Creation** - Build React components with TypeScript
- **UI Implementation** - Use pre-configured Tailwind CSS and shadcn/ui
- **State Management** - Implement with React hooks
- **Form Handling** - Create interactive forms and inputs
- **Data Visualization** - Add charts and graphs
- **API Integration** - Fetch and display data

### Quick Development Features
- **Hot Reload** - Instant updates during development
- **Type Safety** - Catch errors early with TypeScript
- **Modern Syntax** - Use latest JavaScript/TypeScript features
- **Component Library** - Pre-built accessible components
- **Responsive Design** - Mobile-first with Tailwind CSS

## 🧩 Adding Components

### Using shadcn/ui Components

Add pre-built components easily:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add form
```

### Custom Components

Create your own components in the `src/` directory:

```typescript
// src/components/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
};
```

## 🎨 Styling with Tailwind CSS

This template uses Tailwind CSS for styling:

```typescript
// Example component with Tailwind classes
export const StyledComponent = () => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">Hello World</h1>
        <p className="text-gray-600 mt-2">This is styled with Tailwind CSS</p>
      </div>
    </div>
  );
};
```

## 📋 Common Outlier AI Task Patterns

### 1. Data Display Component
```typescript
interface DataItem {
  id: number;
  name: string;
  value: number;
}

export const DataList: React.FC<{ data: DataItem[] }> = ({ data }) => {
  return (
    <div className="space-y-2">
      {data.map(item => (
        <div key={item.id} className="p-3 border rounded">
          <span className="font-medium">{item.name}</span>
          <span className="ml-2 text-gray-600">{item.value}</span>
        </div>
      ))}
    </div>
  );
};
```

### 2. Interactive Form
```typescript
import { useState } from 'react';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        className="w-full p-2 border rounded"
      />
      {/* Add more fields... */}
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </form>
  );
};
```

### 3. API Data Fetching
```typescript
import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

export const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid gap-4">
      {users.map(user => (
        <div key={user.id} className="p-4 border rounded">
          <h3 className="font-bold">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
        </div>
      ))}
    </div>
  );
};
```

## 🔧 Configuration

### Path Aliases
The template is configured with path aliases for cleaner imports:

```typescript
// Instead of: import { MyComponent } from '../../../components/MyComponent'
// Use: import { MyComponent } from '@/components/MyComponent'
```

### Tailwind CSS
Customize colors, spacing, and other design tokens in `tailwind.config.js`.

### TypeScript
Adjust TypeScript settings in `tsconfig.json` for stricter or looser type checking.

## 📝 Tips for Outlier AI Tasks

1. **Start with the App.tsx file** - This is your main entry point
2. **Use TypeScript interfaces** - Define types for your data structures
3. **Leverage Tailwind classes** - Fast styling without writing CSS
4. **Add components incrementally** - Build and test one feature at a time
5. **Use browser dev tools** - Debug with React Developer Tools
6. **Keep components small** - Easier to test and maintain

## 🤔 Troubleshooting

### Port Already in Use
If port 3000 is busy, Vite will automatically try the next available port.

### TypeScript Errors
Run `npm run lint` to check for TypeScript and ESLint issues.

### Dependency Issues
Delete `node_modules` and run `npm install` again:
```bash
rmdir /s node_modules
npm install
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Vite Guide](https://vitejs.dev/guide/)

---

**Ready to code?** Start by editing `src/App.tsx` and build your solution! 🚀
