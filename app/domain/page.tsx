import PageTitle from '@/components/PageTitle';
import DomainChecker from './DomainChecker';

export const metadata = {
  title: 'Домен',
  description: 'Проверка свободен ли домен',
};

function DomainTips() {
  return (
    <section className="mt-10 rounded-xl border bg-muted/30 p-5 leading-relaxed">
      <h2 className="text-xl font-semibold mb-3">Памятка: как выбрать домен</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Коротко, понятно и без лишних дефисов: легче запомнить и продиктовать.</li>
        <li>Старайтесь использовать бренд или ключевое слово (но без переспама).</li>
        <li>Выбирайте подходящую зону: <code>.ru</code> — для РФ, <code>.com</code> — универсально, <code>.io</code>/<code>.ai</code> — про технологии и стартапы.</li>
        <li>Защитите бренд: зарегистрируйте вариации и соседние зоны (<code>.ru</code>, <code>.com</code>, транслитерации).</li>
        <li>Проверьте юридические риски: не используйте чужие товарные знаки.</li>
      </ul>

      <h3 className="text-lg font-medium mt-5 mb-2">Что нельзя вводить при выборе домена</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li>Не вставляйте URL: без <code>http://</code>, <code>https://</code>, путей (<code>/page</code>) и параметров (<code>?a=1</code>).</li>
        <li>Не используйте пробелы, подчёркивания <code>_</code>, спецсимволы и эмодзи.</li>
        <li>Лейблы не могут начинаться/заканчиваться дефисом, пустые лейблы (<code>..</code>) запрещены.</li>
        <li>TLD из одной буквы, лейблы &gt;63 символов и домен &gt;253 символов — недопустимы.</li>
        <li>IP-адрес — это не регистрируемый домен.</li>
        <li>Кириллица допустима — она автоматически конвертируется в punycode при проверке.</li>
      </ul>
    </section>
  );
}

export default function DomainPage() {
  return (
    <main className="flex flex-col min-h-screen max-w-[95rem] w-full mx-auto px-4 py-8">
      <PageTitle className="text-subtitle pb-6" imgSrc="" imgAlt="">
        Проверка домена
      </PageTitle>
      <DomainChecker />
      <DomainTips />
    </main>
  );
}
