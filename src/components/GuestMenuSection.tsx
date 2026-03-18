import { useState } from "react";
import Icon from "@/components/ui/icon";

const GUEST_ORDER_URL = "https://functions.poehali.dev/eecccb17-ab4d-4755-9f80-b05e364a831a";

const HOT_DISHES = [
  { id: "halibut", label: "Стейк из палтуса с рисом", emoji: "🐟", desc: "Нежный стейк из палтуса, поданный с ароматным рисом" },
  { id: "pork", label: "Стейк из свинины на углях с картофельными дольками", emoji: "🥩", desc: "Сочный стейк на углях с хрустящим картофелем" },
  { id: "lamb", label: "Седло ягнёнка со спаржей гриль", emoji: "🍖", desc: "Изысканное седло ягнёнка с запечённой спаржей" },
  { id: "bulgogi", label: "Пульгоги", emoji: "🥢", desc: "Корейская говядина в маринаде с овощами" },
];

const ALCOHOL_OPTIONS = [
  { id: "cognac", label: "Коньяк", emoji: "🥃" },
  { id: "vodka", label: "Водка", emoji: "🍸" },
  { id: "wine_red", label: "Вино красное полусладкое", emoji: "🍷" },
  { id: "wine_rose", label: "Розовое полусухое", emoji: "🌸" },
  { id: "champagne_sweet", label: "Шампанское сладкое", emoji: "🥂" },
  { id: "champagne_semi", label: "Шампанское полусухое", emoji: "🍾" },
  { id: "none", label: "Не пью", emoji: "🧃" },
];

function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 my-4">
      <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/50" />
      <span className="text-gold/60 text-xs">✦</span>
      <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/50" />
    </div>
  );
}

export default function GuestMenuSection() {
  const [guestName, setGuestName] = useState("");
  const [hotDish, setHotDish] = useState("");
  const [alcohol, setAlcohol] = useState<string[]>([]);
  const [wish, setWish] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleAlcohol(id: string) {
    setAlcohol(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  }

  async function handleSubmit() {
    if (!guestName.trim()) {
      setError("Пожалуйста, укажите ваше имя");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(GUEST_ORDER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_name: guestName,
          hot_dish: hotDish,
          alcohol: alcohol.map(id => ALCOHOL_OPTIONS.find(a => a.id === id)?.label || id),
          wish,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Что-то пошло не так, попробуйте снова");
      }
    } catch {
      setError("Ошибка соединения, попробуйте снова");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="меню" className="py-20 px-6 bg-petal/40">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-caveat text-gold text-xl mb-2">ваши предпочтения</p>
          <h2 className="font-cormorant-sc text-3xl md:text-4xl text-deep-rose">Меню & Пожелания</h2>
          <Divider />
          <p className="font-cormorant text-lg text-rose/70">
            Выберите блюдо и напитки, а также оставьте пожелание молодожёнам
          </p>
        </div>

        {submitted ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-10 border border-gold/20 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-rose/10 flex items-center justify-center mx-auto mb-4">
              <Icon name="Heart" size={32} className="text-rose" />
            </div>
            <h3 className="font-cormorant-sc text-2xl text-deep-rose mb-2">Спасибо!</h3>
            <p className="font-cormorant text-lg text-rose/70">Ваши пожелания и выбор блюд приняты. До встречи на свадьбе!</p>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gold/20 shadow-sm space-y-8">

            {/* Имя */}
            <div>
              <label className="font-cormorant-sc text-sm tracking-widest text-deep-rose block mb-3">Ваше имя *</label>
              <input
                type="text"
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                placeholder="Иван Иванов"
                className="w-full border border-gold/30 rounded-xl px-4 py-3 font-cormorant text-lg text-deep-rose bg-white/60 focus:outline-none focus:border-rose/50 placeholder:text-rose/30"
              />
            </div>

            {/* Горячее */}
            <div>
              <label className="font-cormorant-sc text-sm tracking-widest text-deep-rose block mb-3">Горячее блюдо</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {HOT_DISHES.map(dish => (
                  <button
                    key={dish.id}
                    onClick={() => setHotDish(hotDish === dish.label ? "" : dish.label)}
                    className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                      hotDish === dish.label
                        ? "border-rose bg-rose/10 shadow-sm"
                        : "border-gold/20 bg-white/40 hover:border-rose/40 hover:bg-rose/5"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{dish.emoji}</span>
                      <span className="font-cormorant-sc text-sm text-deep-rose">{dish.label}</span>
                      {hotDish === dish.label && (
                        <Icon name="Check" size={14} className="text-rose ml-auto" />
                      )}
                    </div>
                    <p className="font-cormorant text-rose/60 text-sm">{dish.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Алкоголь */}
            <div>
              <label className="font-cormorant-sc text-sm tracking-widest text-deep-rose block mb-3">Напитки (можно несколько)</label>
              <div className="flex flex-wrap gap-2">
                {ALCOHOL_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => toggleAlcohol(opt.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border font-cormorant text-sm transition-all duration-200 ${
                      alcohol.includes(opt.id)
                        ? "border-rose bg-rose/10 text-deep-rose shadow-sm"
                        : "border-gold/20 bg-white/40 text-rose/70 hover:border-rose/40"
                    }`}
                  >
                    <span>{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Пожелание */}
            <div>
              <label className="font-cormorant-sc text-sm tracking-widest text-deep-rose block mb-3">Пожелание молодожёнам</label>
              <textarea
                value={wish}
                onChange={e => setWish(e.target.value)}
                placeholder="Напишите тёплые слова для Анастасии и Артёма..."
                rows={4}
                className="w-full border border-gold/30 rounded-xl px-4 py-3 font-cormorant text-lg text-deep-rose bg-white/60 focus:outline-none focus:border-rose/50 placeholder:text-rose/30 resize-none"
              />
            </div>

            {error && (
              <p className="font-cormorant text-red-400 text-center">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-deep-rose text-ivory font-cormorant-sc text-sm tracking-widest rounded-xl hover:bg-rose transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Icon name="Loader2" size={18} className="animate-spin" />
              ) : (
                <Icon name="Send" size={16} />
              )}
              {loading ? "Отправляем..." : "Отправить"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}