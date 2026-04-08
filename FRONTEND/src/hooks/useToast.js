import { useState, useCallback } from "react";

const useToast = () => {
  const [items, setItems] = useState([]);

  const push = useCallback((msg, type = "success") => {
    const id = Date.now() + Math.random();
    setItems((p) => [...p, { id, msg, type }]);
    setTimeout(() => setItems((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);

  const pop = useCallback((id) => setItems((p) => p.filter((t) => t.id !== id)), []);

  return { items, push, pop };
};

export default useToast;