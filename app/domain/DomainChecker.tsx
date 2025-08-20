'use client';
import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type ValidationResult = { ok: boolean; message: string; normalized?: string };

function isIPv4(host: string) {
  const parts = host.split('.');
  if (parts.length !== 4) return false;
  return parts.every(p => {
    if (!/^\d{1,3}$/.test(p)) return false;
    const n = Number(p);
    return n >= 0 && n <= 255;
  });
}

function normalizeToHostname(value: string): { cleaned: string; changed: boolean } {
  const raw = value.trim();
  if (!raw) return { cleaned: '', changed: false };

  // Попробуем распарсить как URL, чтобы вытащить hostname и сразу получить punycode
  try {
    const url = new URL(raw.includes('://') ? raw : `http://${raw}`);
    let host = url.hostname.toLowerCase();
    if (host.endsWith('.')) host = host.slice(0, -1); // убираем точку в конце
    if (host.startsWith('www.')) host = host.slice(4); // не считаем www частью домена
    return { cleaned: host, changed: host !== raw };
  } catch {
    // Если не похоже на URL, просто вернём очищенную строку
    return { cleaned: raw.toLowerCase(), changed: raw !== value };
  }
}

// Главная проверка по правилам выше
function validateDomain(input: string): ValidationResult {
  const { cleaned } = normalizeToHostname(input);

  if (!cleaned) return { ok: false, message: 'Введите доменное имя.' };

  if (cleaned.length > 253) {
    return { ok: false, message: 'Длина домена не должна превышать 253 символа.' };
  }

  if (isIPv4(cleaned) || cleaned.includes(':')) {
    return { ok: false, message: 'IP-адрес не является доменным именем для регистрации.' };
  }

  if (/[^a-z0-9.-]/i.test(cleaned)) {
    return { ok: false, message: 'Недопустимые символы. Разрешены: латиница, цифры, дефис и точка.' };
  }

  if (cleaned.startsWith('.') || cleaned.endsWith('.')) {
    return { ok: false, message: 'Домен не может начинаться или заканчиваться точкой.' };
  }

  if (cleaned.includes('..')) {
    return { ok: false, message: 'Между точками не может быть пустого сегмента.' };
  }

  const labels = cleaned.split('.');
  if (labels.length < 2) {
    return { ok: false, message: 'Должен быть как минимум один поддомен и зона (например, example.com).' };
  }

  for (const label of labels) {
    if (label.length < 1 || label.length > 63) {
      return { ok: false, message: 'Каждый сегмент (между точками) — от 1 до 63 символов.' };
    }
    if (label.startsWith('-') || label.endsWith('-')) {
      return { ok: false, message: 'Сегмент не может начинаться или заканчиваться дефисом.' };
    }
  }

  const tld = labels[labels.length - 1];
  const tldOk = /^([a-z]{2,63}|xn--[a-z0-9]{1,59})$/i.test(tld);
  if (!tldOk) {
    return { ok: false, message: 'Некорректная доменная зона. Используйте буквы (2–63) или punycode (xn--…).' };
  }

  return { ok: true, message: 'Формат домена корректен.', normalized: cleaned };
}

export default function DomainChecker() {
  const [input, setInput] = useState('');
  const [normalized, setNormalized] = useState<string>('');
  const [result, setResult] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validation: ValidationResult = useMemo(
    () => validateDomain(input),
    [input]
  );

  useEffect(() => {
    // Показываем нормализованное значение, если оно отличается (например, удалён протокол/путь)
    if (validation.ok && validation.normalized && validation.normalized !== normalized) {
      setNormalized(validation.normalized);
    } else if (!validation.ok) {
      setNormalized('');
    }
  }, [validation]);

  const checkDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setError('');

    const v = validateDomain(input);
    if (!v.ok || !v.normalized) {
      setError(v.message);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/check-domain?domain=${encodeURIComponent(v.normalized)}`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setResult(data.available);
    } catch {
      setError('Не удалось проверить домен. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={checkDomain} className="flex flex-col gap-3 max-w-lg">
      <label className="text-sm font-medium">Домен для проверки</label>
      <Input
        placeholder="example.com"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        aria-invalid={!validation.ok}
      />
      <div className="text-sm">
        {validation.ok ? (
          <p className="text-green-600">
            {validation.message}
            {normalized && normalized !== input && (
              <> — будет проверен как <code>{normalized}</code>.</>
            )}
          </p>
        ) : (
          <p className="text-red-600">{validation.message}</p>
        )}
      </div>

      <Button type="submit" disabled={loading || !validation.ok}>
        {loading ? 'Проверка...' : 'Проверить'}
      </Button>

      {result !== null && (
        <p className={`mt-2 ${result ? 'text-green-700' : 'text-orange-700'}`}>
          {normalized ? <strong>{normalized}</strong> : null}{' '}
          {result ? '— домен свободен' : '— домен занят'}
        </p>
      )}
      {error && <p className="mt-2 text-red-600">{error}</p>}
    </form>
  );
}
