
interface OpsData {
  insert: string;
  attributes?: {
    link?: string;
    bold?: boolean;
    italic?: boolean;
  };
}

interface JSONData {
  ops: OpsData[];
}

const renderOps = (ops: OpsData[]) => {
  return ops.map((op, index) => {
    if (op.attributes) {
      const { link, bold, italic } = op.attributes;
      if (link) {
        return (
          <a key={index} href={link}>
            {op.insert}
          </a>
        );
      } else if (bold) {
        return <strong key={index}>{op.insert}</strong>;
      } else if (italic) {
        return <em key={index}>{op.insert}</em>;
      }
    }
    return <span key={index}>{op.insert}</span>;
  });
};

const parseAndRenderJSON = (jsonData: string) => {
  try {
    const data: JSONData = JSON.parse(jsonData);
    if (data.ops && Array.isArray(data.ops)) {
      return renderOps(data.ops);
    }
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
  return null;
};

// Usage example:
const json = `{"ops":[{"insert":"I've been involved with Artificial Intelligence (AI) before it was a thing..."}]}`;
const renderedContent = parseAndRenderJSON(json);

const TestFunc = () => {
  return renderedContent
}

// In your React component's render method: