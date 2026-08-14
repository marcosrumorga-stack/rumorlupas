// Every translatable string on the site lives here, so adding a language means
// editing this one file. Markup carries data-i18n="<key>" (text), data-i18n-html
// (when the string contains inline tags) or data-i18n-aria (aria-label).
// Scripts that build markup at runtime call t("<key>") instead.

const I18N = {
  pt: {
    "nav.catalog": "Catálogo",
    "nav.about": "Sobre",
    "aria.cart": "Abrir carrinho",
    "aria.menu": "Abrir menu",
    "aria.lang": "Idioma",
    "aria.close": "Fechar",
    "aria.prevPhoto": "Foto anterior",
    "aria.nextPhoto": "Próxima foto",

    "hero.title": "Veja o mundo<br>com <span>estilo</span>",
    "hero.subtitle": "Óculos premium, sem complicação: você escolhe o modelo, paga com segurança e recebe rapidinho em casa.",
    "hero.cta": "Ver catálogo",
    "hero.about": "Sobre a marca",
    "hero.trust1": "Proteção UV400",
    "hero.trust2": "Envio para todo Portugal",
    "hero.trust3": "Pagamento seguro Stripe",

    "catalog.title": "Catálogo",
    "catalog.note.lupas": "Todos os modelos vêm com micro bag, pano de limpeza e case.",
    "category.lupas": "Lupas",
    "product.soon": "Foto em breve",
    "product.add": "Adicionar ao carrinho",
    "product.soldOut": "Esgotado",
    "product.photo": "foto",
    "price.off": "de desconto",

    "about.title": "Sobre a <span class=\"brandmark\"><img src=\"images/boar-icon.png\" alt=\"\" class=\"brandmark__icon\">RUMOR<span>LUPAS</span></span>",
    "about.text": "A RumorLupas nasceu da paixão por óculos de sol de qualidade. Trabalhamos com modelos de qualidade premium, unindo proteção UV, durabilidade e o estilo que você procura para o dia a dia, pra prática esportiva e principalmente pra curtir aquela festa/rave.",

    "clients.title": "Quem já usa",
    "clients.subtitle": "Gente real com as nossas lupas, publicada com autorização.",

    "ig.title": "Siga no Instagram",
    "ig.subtitle": "Novidades, lançamentos e bastidores da RumorLupas — siga lá pra não perder nada.",
    "ig.cta": "Seguir @rumorlupas",

    "footer.rights": "Todos os direitos reservados.",
    "footer.privacy": "Política de Privacidade",
    "footer.terms": "Termos e Condições",
    "footer.stripe": "Pagamentos processados com segurança via Stripe.",

    "cart.title": "Seu carrinho",
    "cart.empty": "Seu carrinho está vazio.",
    "cart.total": "Total",
    "cart.checkout": "Finalizar compra",
    "cart.processing": "Processando...",
    "cart.note": "Pagamento seguro via Stripe · Envio para Portugal (4,90 €)",
    "ship.bar": "Envio grátis em pedidos acima de 80 €",
    "ship.remaining": "Faltam {x} para você ganhar envio grátis",
    "ship.unlocked": "Boa! Você tem envio grátis neste pedido",
    "cart.remove": "Remover",
    "cart.error": "Não foi possível iniciar o pagamento. Tente novamente em instantes.",
    "cart.canceled": "Pagamento cancelado. Seu carrinho continua salvo.",
    "stock.adjusted": "Só restam {n} unidades de {name}. Ajustamos seu carrinho.",
    "stock.soldOut": "{name} esgotou e saiu do seu carrinho.",

    "thanks.eyebrow": "Pedido confirmado",
    "thanks.title": "Obrigado pela compra!",
    "thanks.text": "Recebemos seu pedido e já estamos preparando o envio. Ele chega em 2 a 5 dias úteis.",
    "thanks.ref": "Referência do pedido",
    "thanks.refNote": "Guarde essa referência se precisar falar com a gente.",
    "thanks.help": "Dúvidas sobre o pedido? Escreva para <a href=\"mailto:rumorlupas@gmail.com\">rumorlupas@gmail.com</a>.",
    "thanks.back": "Voltar ao catálogo",

    "nf.eyebrow": "Erro 404",
    "nf.title": "Esta página não existe",
    "nf.text": "O link pode estar mal escrito, ou a página pode ter sido removida. O catálogo continua onde estava.",
    "nf.home": "Página inicial",

    "pp.back": "← Voltar ao catálogo",
    "pp.notFound": "Produto não encontrado.",
    "pp.history": "A história do modelo",
    "pp.historySoon": "Em breve, mais detalhes sobre a história deste modelo.",
    "pp.includes": "Vem com",
    "pp.bag": "Micro bag",
    "pp.cloth": "Pano de limpeza",
    "pp.case": "Case",
    "assure.returns": "14 dias para devolver",
    "assure.delivery": "Entrega em 2 a 5 dias úteis",
    "footer.contact": "Dúvidas? <a href=\"mailto:rumorlupas@gmail.com\">rumorlupas@gmail.com</a>",

    "legal.back": "← Voltar ao site",
    "legal.notice": "Este documento só tem valor legal na versão em português.",

    // Keyed by the colour's own id, not by product, so two models sharing a
    // colour share the string. A colour with no entry here falls back to the
    // `name` written in products.js, which is always Portuguese.
    "color.preto": "Preto",
    "color.24k-lente-esmeralda": "24K · lente esmeralda",
    "color.cinza-fosca-preta": "Cinza fosca · lente preta",
    "color.cinza-fosca-espelhada": "Cinza fosca · lente espelhada",
    "color.cinza-fosca-azul": "Cinza fosca · lente azul",
    "color.cinza-fosca-amarela": "Cinza fosca · lente amarela",
    "color.cinza-fosca-tanzanite": "Cinza fosca · lente tanzanite",
    "color.cinza-escura-espelhada": "Cinza escura · lente espelhada",
    "color.preta-roxa": "Preta · lente roxa",
    "color.preta-lente-preta": "Preta · lente preta",
    "color.preta-lente-laranja": "Preta · lente laranja",
    "color.preta-transparente-lente-preta": "Preta transparente · lente preta",
    "color.preta-transparente-lente-espelhada": "Preta transparente · lente espelhada",
    "color.branca-transparente-lente-laranja": "Branca transparente · lente laranja",
    "color.branca-lente-azul": "Branca · lente azul",
    "color.branca-lente-transparente": "Branca · lente transparente",
    "color.castanha-lente-gold": "Castanha · lente dourada",

    "history.eye-jacket-45": "Lançado em 1996, o Eye Jacket foi um dos modelos que definiu a estética esportiva da Oakley nos anos 90, com sua lente envolvente e visual futurista. Rapidamente virou item de estilo fora das pistas, adotado pela cena rave e pelo streetwear da época. Essa versão \"Redux\" resgata a silhueta original com acabamento atualizado.",
    "history.plantaris-50": "O Plantaris representa a leitura mais recente da Oakley sobre o formato wrap clássico da marca, com maior cobertura lateral e um encaixe pensado tanto para performance quanto para o dia a dia. Une a herança esportiva da marca a um visual mais contemporâneo.",
    "history.juliet-45": "A Juliet integra a lendária linha X-Metal da Oakley, lançada no fim dos anos 90 e batizada em referência ao desenho técnico das lentes. Com armação metálica e visual arrojado, tornou-se peça cult no automobilismo e no streetwear, sendo um dos modelos mais colecionados da marca até hoje.",
    "history.xx-45": "O XX segue a linguagem geométrica e metálica que consagrou a família X-Metal da Oakley, com uma proposta ainda mais compacta e angular. Um modelo para quem busca o visual técnico da marca em um formato mais discreto.",
    "history.plate-55": "O Plate aposta em uma armação mais robusta e um visual urbano, afastando-se da estética puramente esportiva da Oakley em direção ao dia a dia da cidade sem abandonar a durabilidade que a marca é conhecida por entregar.",
    "history.gascan-50": "Introduzido no início dos anos 2000, o Gascan é hoje um dos formatos mais duradouros do catálogo Oakley — simples, versátil e igualmente à vontade na praia, na cidade ou na trilha. Sua permanência em produção por mais de duas décadas é rara entre os modelos da marca.",
    "history.splice-53": "O Splice combina uma armação semi-arredondada com lente ampla, equilibrando o DNA esportivo da Oakley com um visual mais suave, pensado para quem quer proteção solar sem abrir mão do conforto no uso prolongado.",
    "history.monster-dog-47": "O Monster Dog nasceu da fase mais experimental do design da Oakley nos anos 2000, com uma armação larga e presença marcante. Um modelo para quem não tem medo de um visual mais ousado.",
    "history.dartboard-50": "O Dartboard traz uma lente circular ampla sobre uma armação leve, equilibrando um visual retrô com a tecnologia de lentes que a Oakley desenvolveu para uso esportivo intenso.",
    "history.flak-2xl-45": "O Flak é uma das silhuetas mais populares e duradouras da Oakley, adotado amplamente no ciclismo e no atletismo pela estabilidade e campo de visão. A versão 2.0 XL amplia o encaixe para rostos maiores, mantendo a mesma proposta de performance.",
    "history.pitboss-53": "O Pit Boss II é um resgate de um dos formatos mais robustos do catálogo Oakley do início dos anos 2000, com armação espessa e presença forte — um visual que remete diretamente à estética \"Y2K\" que voltou às ruas nos últimos anos.",
  },

  en: {
    "nav.catalog": "Catalogue",
    "nav.about": "About",
    "aria.cart": "Open cart",
    "aria.menu": "Open menu",
    "aria.lang": "Language",
    "aria.close": "Close",
    "aria.prevPhoto": "Previous photo",
    "aria.nextPhoto": "Next photo",

    "hero.title": "See the world<br>in <span>style</span>",
    "hero.subtitle": "Premium sunglasses, no fuss: pick your model, pay securely and have them at your door in days.",
    "hero.cta": "See the catalogue",
    "hero.about": "About the brand",
    "hero.trust1": "UV400 protection",
    "hero.trust2": "Shipping within Portugal",
    "hero.trust3": "Secure payment by Stripe",

    "catalog.title": "Catalogue",
    "catalog.note.lupas": "Every model comes with a micro bag, a cleaning cloth and a case.",
    "category.lupas": "Lupas",
    "product.soon": "Photo coming soon",
    "product.add": "Add to cart",
    "product.soldOut": "Sold out",
    "product.photo": "photo",
    "price.off": "off",

    "about.title": "About <span class=\"brandmark\"><img src=\"images/boar-icon.png\" alt=\"\" class=\"brandmark__icon\">RUMOR<span>LUPAS</span></span>",
    "about.text": "RumorLupas was born out of a love for well-made sunglasses. We work with premium models that bring together UV protection, durability and the look you want — for everyday wear, for sport, and above all for the night out or the rave.",

    "clients.title": "Already wearing them",
    "clients.subtitle": "Real people in our sunglasses, shared with their permission.",

    "ig.title": "Follow us on Instagram",
    "ig.subtitle": "New arrivals, drops and behind the scenes at RumorLupas — follow along so you don't miss anything.",
    "ig.cta": "Follow @rumorlupas",

    "footer.rights": "All rights reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms and Conditions",
    "footer.stripe": "Payments processed securely by Stripe.",

    "cart.title": "Your cart",
    "cart.empty": "Your cart is empty.",
    "cart.total": "Total",
    "cart.checkout": "Checkout",
    "cart.processing": "Processing...",
    "cart.note": "Secure payment by Stripe · Shipping within Portugal (€4.90)",
    "ship.bar": "Free shipping on orders over €80",
    "ship.remaining": "{x} away from free shipping",
    "ship.unlocked": "Nice — this order ships free",
    "cart.remove": "Remove",
    "cart.error": "We couldn't start the payment. Please try again in a moment.",
    "cart.canceled": "Payment canceled. Your cart has been kept.",
    "stock.adjusted": "Only {n} left of {name}. We've adjusted your cart.",
    "stock.soldOut": "{name} sold out and has left your cart.",

    "thanks.eyebrow": "Order confirmed",
    "thanks.title": "Thank you for your order",
    "thanks.text": "We have your order and we're getting it ready to ship. It arrives in 2 to 5 working days.",
    "thanks.ref": "Order reference",
    "thanks.refNote": "Keep this reference if you need to get in touch.",
    "thanks.help": "Questions about your order? Write to <a href=\"mailto:rumorlupas@gmail.com\">rumorlupas@gmail.com</a>.",
    "thanks.back": "Back to the catalogue",

    "nf.eyebrow": "Error 404",
    "nf.title": "This page doesn't exist",
    "nf.text": "The link may be mistyped, or the page may have been removed. The catalogue is still where it was.",
    "nf.home": "Home page",

    "pp.back": "← Back to the catalogue",
    "pp.notFound": "Product not found.",
    "pp.history": "The story behind the model",
    "pp.historySoon": "More on the story of this model soon.",
    "pp.includes": "In the box",
    "pp.bag": "Micro bag",
    "pp.cloth": "Cleaning cloth",
    "pp.case": "Case",
    "assure.returns": "14 days to return it",
    "assure.delivery": "Delivered in 2 to 5 working days",
    "footer.contact": "Questions? <a href=\"mailto:rumorlupas@gmail.com\">rumorlupas@gmail.com</a>",

    "legal.back": "← Back to the site",
    "legal.notice": "This document is in Portuguese. Only the Portuguese version is legally binding.",

    "color.preto": "Black",
    "color.24k-lente-esmeralda": "24K · emerald lens",
    "color.cinza-fosca-preta": "Matte grey · black lens",
    "color.cinza-fosca-espelhada": "Matte grey · mirrored lens",
    "color.cinza-fosca-azul": "Matte grey · blue lens",
    "color.cinza-fosca-amarela": "Matte grey · yellow lens",
    "color.cinza-fosca-tanzanite": "Matte grey · tanzanite lens",
    "color.cinza-escura-espelhada": "Dark grey · mirrored lens",
    "color.preta-roxa": "Black · purple lens",
    "color.preta-lente-preta": "Black · black lens",
    "color.preta-lente-laranja": "Black · orange lens",
    "color.preta-transparente-lente-preta": "Smoke · black lens",
    "color.preta-transparente-lente-espelhada": "Smoke · mirrored lens",
    "color.branca-transparente-lente-laranja": "Clear · orange lens",
    "color.branca-lente-azul": "White · blue lens",
    "color.branca-lente-transparente": "White · clear lens",
    "color.castanha-lente-gold": "Brown · gold lens",

    "history.eye-jacket-45": "Released in 1996, the Eye Jacket was one of the models that defined Oakley's sporting look in the nineties, with its wraparound lens and futuristic shape. It quickly became a style piece off the track, taken up by the rave scene and the streetwear of the day. This \"Redux\" version brings back the original silhouette with an updated finish.",
    "history.plantaris-50": "The Plantaris is Oakley's most recent take on the wrap shape the brand is known for, with more coverage at the sides and a fit meant for both performance and everyday wear. It carries the brand's sporting heritage into a more contemporary look.",
    "history.juliet-45": "The Juliet belongs to Oakley's legendary X-Metal line, launched in the late nineties and named after the technical drawing of its lenses. With its metal frame and bold shape, it became a cult piece in motorsport and streetwear, and remains one of the brand's most collected models.",
    "history.xx-45": "The XX follows the geometric, metallic language that made Oakley's X-Metal family famous, in an even more compact and angular form. A model for anyone who wants the brand's technical look in a quieter shape.",
    "history.plate-55": "The Plate goes for a sturdier frame and an urban look, stepping away from Oakley's purely sporting side towards city life — without giving up the durability the brand is known for.",
    "history.gascan-50": "Introduced in the early 2000s, the Gascan is now one of the longest-running shapes in Oakley's catalogue — simple, versatile and equally at home on the beach, in the city or on the trail. Staying in production for more than two decades is rare among the brand's models.",
    "history.splice-53": "The Splice pairs a semi-rounded frame with a wide lens, balancing Oakley's sporting DNA with a softer look — made for anyone who wants sun protection without giving up comfort over a long day.",
    "history.monster-dog-47": "The Monster Dog came out of Oakley's most experimental design period in the 2000s, with a wide frame and real presence. A model for anyone unafraid of a bolder look.",
    "history.dartboard-50": "The Dartboard sets a wide circular lens on a light frame, balancing a retro look with the lens technology Oakley developed for hard sporting use.",
    "history.flak-2xl-45": "The Flak is one of Oakley's most popular and enduring silhouettes, widely worn in cycling and athletics for its stability and field of view. The 2.0 XL version widens the fit for larger faces while keeping the same performance intent.",
    "history.pitboss-53": "The Pit Boss II revives one of the chunkiest shapes in Oakley's early-2000s catalogue, with a thick frame and strong presence — a look that points straight back at the Y2K aesthetic that has returned to the streets in recent years.",
  },

  es: {
    "nav.catalog": "Catálogo",
    "nav.about": "Sobre",
    "aria.cart": "Abrir carrito",
    "aria.menu": "Abrir menú",
    "aria.lang": "Idioma",
    "aria.close": "Cerrar",
    "aria.prevPhoto": "Foto anterior",
    "aria.nextPhoto": "Foto siguiente",

    "hero.title": "Mira el mundo<br>con <span>estilo</span>",
    "hero.subtitle": "Gafas premium, sin complicaciones: elige el modelo, paga con seguridad y recíbelas en casa en pocos días.",
    "hero.cta": "Ver catálogo",
    "hero.about": "Sobre la marca",
    "hero.trust1": "Protección UV400",
    "hero.trust2": "Envío a Portugal",
    "hero.trust3": "Pago seguro con Stripe",

    "catalog.title": "Catálogo",
    "catalog.note.lupas": "Todos los modelos incluyen micro bag, paño de limpieza y estuche.",
    "category.lupas": "Lupas",
    "product.soon": "Foto próximamente",
    "product.add": "Añadir al carrito",
    "product.soldOut": "Agotado",
    "product.photo": "foto",
    "price.off": "de descuento",

    "about.title": "Sobre <span class=\"brandmark\"><img src=\"images/boar-icon.png\" alt=\"\" class=\"brandmark__icon\">RUMOR<span>LUPAS</span></span>",
    "about.text": "RumorLupas nació de la pasión por unas buenas gafas de sol. Trabajamos con modelos premium que unen protección UV, durabilidad y el estilo que buscas — para el día a día, para el deporte y sobre todo para esa fiesta o rave.",

    "clients.title": "Quién ya las usa",
    "clients.subtitle": "Gente real con nuestras gafas, publicada con su permiso.",

    "ig.title": "Síguenos en Instagram",
    "ig.subtitle": "Novedades, lanzamientos y el detrás de cámaras de RumorLupas — síguenos para no perderte nada.",
    "ig.cta": "Seguir @rumorlupas",

    "footer.rights": "Todos los derechos reservados.",
    "footer.privacy": "Política de Privacidad",
    "footer.terms": "Términos y Condiciones",
    "footer.stripe": "Pagos procesados de forma segura con Stripe.",

    "cart.title": "Tu carrito",
    "cart.empty": "Tu carrito está vacío.",
    "cart.total": "Total",
    "cart.checkout": "Finalizar compra",
    "cart.processing": "Procesando...",
    "cart.note": "Pago seguro con Stripe · Envío a Portugal (4,90 €)",
    "ship.bar": "Envío gratis en pedidos superiores a 80 €",
    "ship.remaining": "Te faltan {x} para el envío gratis",
    "ship.unlocked": "¡Genial! Este pedido tiene envío gratis",
    "cart.remove": "Eliminar",
    "cart.error": "No se pudo iniciar el pago. Inténtalo de nuevo en un momento.",
    "cart.canceled": "Pago cancelado. Tu carrito sigue guardado.",
    "stock.adjusted": "Solo quedan {n} unidades de {name}. Ajustamos tu carrito.",
    "stock.soldOut": "{name} se agotó y salió de tu carrito.",

    "thanks.eyebrow": "Pedido confirmado",
    "thanks.title": "¡Gracias por tu compra!",
    "thanks.text": "Recibimos tu pedido y ya lo estamos preparando para el envío. Llega en 2 a 5 días hábiles.",
    "thanks.ref": "Referencia del pedido",
    "thanks.refNote": "Guarda esta referencia por si necesitas contactarnos.",
    "thanks.help": "¿Dudas sobre tu pedido? Escríbenos a <a href=\"mailto:rumorlupas@gmail.com\">rumorlupas@gmail.com</a>.",
    "thanks.back": "Volver al catálogo",

    "nf.eyebrow": "Error 404",
    "nf.title": "Esta página no existe",
    "nf.text": "El enlace puede estar mal escrito, o la página puede haber sido eliminada. El catálogo sigue donde estaba.",
    "nf.home": "Página de inicio",

    "pp.back": "← Volver al catálogo",
    "pp.notFound": "Producto no encontrado.",
    "pp.history": "La historia del modelo",
    "pp.historySoon": "Pronto, más detalles sobre la historia de este modelo.",
    "pp.includes": "Incluye",
    "pp.bag": "Micro bag",
    "pp.cloth": "Paño de limpieza",
    "pp.case": "Estuche",
    "assure.returns": "14 días para devolver",
    "assure.delivery": "Entrega en 2 a 5 días hábiles",
    "footer.contact": "¿Dudas? <a href=\"mailto:rumorlupas@gmail.com\">rumorlupas@gmail.com</a>",

    "legal.back": "← Volver al sitio",
    "legal.notice": "Este documento está en portugués. Solo la versión en portugués tiene valor legal.",

    "color.preto": "Negro",
    "color.24k-lente-esmeralda": "24K · lente esmeralda",
    "color.cinza-fosca-preta": "Gris mate · lente negra",
    "color.cinza-fosca-espelhada": "Gris mate · lente espejada",
    "color.cinza-fosca-azul": "Gris mate · lente azul",
    "color.cinza-fosca-amarela": "Gris mate · lente amarilla",
    "color.cinza-fosca-tanzanite": "Gris mate · lente tanzanita",
    "color.cinza-escura-espelhada": "Gris oscuro · lente espejada",
    "color.preta-roxa": "Negro · lente morada",
    "color.preta-lente-preta": "Negro · lente negra",
    "color.preta-lente-laranja": "Negro · lente naranja",
    "color.preta-transparente-lente-preta": "Humo · lente negra",
    "color.preta-transparente-lente-espelhada": "Humo · lente espejada",
    "color.branca-transparente-lente-laranja": "Transparente · lente naranja",
    "color.branca-lente-azul": "Blanco · lente azul",
    "color.branca-lente-transparente": "Blanco · lente transparente",
    "color.castanha-lente-gold": "Marrón · lente dorada",

    "history.eye-jacket-45": "Lanzado en 1996, el Eye Jacket fue uno de los modelos que definió la estética deportiva de Oakley en los noventa, con su lente envolvente y su aire futurista. Pronto se convirtió en pieza de estilo fuera de la pista, adoptada por la escena rave y el streetwear de la época. Esta versión \"Redux\" recupera la silueta original con un acabado actualizado.",
    "history.plantaris-50": "El Plantaris es la lectura más reciente de Oakley sobre el formato wrap clásico de la marca, con mayor cobertura lateral y un ajuste pensado tanto para el rendimiento como para el día a día. Lleva la herencia deportiva de la marca a un aspecto más contemporáneo.",
    "history.juliet-45": "El Juliet forma parte de la legendaria línea X-Metal de Oakley, lanzada a finales de los noventa y bautizada en referencia al dibujo técnico de sus lentes. Con montura metálica y una forma atrevida, se convirtió en pieza de culto en el automovilismo y el streetwear, y sigue siendo uno de los modelos más coleccionados de la marca.",
    "history.xx-45": "El XX sigue el lenguaje geométrico y metálico que consagró a la familia X-Metal de Oakley, en un formato aún más compacto y angular. Un modelo para quien busca el aire técnico de la marca en una forma más discreta.",
    "history.plate-55": "El Plate apuesta por una montura más robusta y un aire urbano, alejándose de la estética puramente deportiva de Oakley hacia el día a día de la ciudad, sin renunciar a la durabilidad por la que se conoce a la marca.",
    "history.gascan-50": "Introducido a principios de los 2000, el Gascan es hoy uno de los formatos más duraderos del catálogo de Oakley — sencillo, versátil e igual de cómodo en la playa, en la ciudad o en la montaña. Mantenerse en producción más de dos décadas es raro entre los modelos de la marca.",
    "history.splice-53": "El Splice combina una montura semirredondeada con una lente amplia, equilibrando el ADN deportivo de Oakley con un aire más suave, pensado para quien quiere protección solar sin renunciar a la comodidad durante todo el día.",
    "history.monster-dog-47": "El Monster Dog nació de la etapa más experimental del diseño de Oakley en los 2000, con una montura ancha y mucha presencia. Un modelo para quien no teme un aspecto más atrevido.",
    "history.dartboard-50": "El Dartboard monta una lente circular amplia sobre una montura ligera, equilibrando un aire retro con la tecnología de lentes que Oakley desarrolló para el uso deportivo intenso.",
    "history.flak-2xl-45": "El Flak es una de las siluetas más populares y duraderas de Oakley, muy usada en ciclismo y atletismo por su estabilidad y campo de visión. La versión 2.0 XL amplía el ajuste para rostros más grandes, manteniendo la misma propuesta de rendimiento.",
    "history.pitboss-53": "El Pit Boss II recupera uno de los formatos más robustos del catálogo de Oakley de principios de los 2000, con montura gruesa y mucha presencia — un aire que remite directamente a la estética Y2K que ha vuelto a las calles en los últimos años.",
  },
};

const LANG_KEY = "rumorlupas_lang";
const HTML_LANG = { pt: "pt-PT", en: "en", es: "es" };

// Drawn rather than written as emoji: Windows ships no flag glyphs, so 🇵🇹
// would show up as the letters "PT". Portuguese gets half Portugal, half
// Brazil, since the shop speaks to both.
const FLAGS = {
  pt: `<svg class="lang__flag" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="4.8" height="16" fill="#006600"/>
    <rect x="4.8" width="7.2" height="16" fill="#FF0000"/>
    <circle cx="4.8" cy="8" r="2.7" fill="#FFCC00"/>
    <circle cx="4.8" cy="8" r="1.5" fill="#FFFFFF"/>
    <circle cx="4.8" cy="8" r="0.8" fill="#FF0000"/>
    <rect x="12" width="12" height="16" fill="#009C3B"/>
    <polygon points="18,2.6 23,8 18,13.4 13,8" fill="#FFDF00"/>
    <circle cx="18" cy="8" r="2.5" fill="#002776"/>
    <path d="M15.7 7.4c1.6-.9 3.4-.6 4.6.4" stroke="#FFFFFF" stroke-width="0.8" fill="none"/>
  </svg>`,
  en: `<svg class="lang__flag" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="24" height="16" fill="#012169"/>
    <path d="M0 0L24 16M24 0L0 16" stroke="#FFFFFF" stroke-width="3.2"/>
    <path d="M0 0L24 16M24 0L0 16" stroke="#C8102E" stroke-width="1.6"/>
    <path d="M12 0V16M0 8H24" stroke="#FFFFFF" stroke-width="5.4"/>
    <path d="M12 0V16M0 8H24" stroke="#C8102E" stroke-width="3.2"/>
  </svg>`,
  es: `<svg class="lang__flag" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="24" height="16" fill="#AA151B"/>
    <rect y="4" width="24" height="8" fill="#F1BF00"/>
  </svg>`,
};

let currentLang = (() => {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && I18N[saved]) return saved;
  } catch {
    // localStorage can throw in private mode; fall through to the browser hint
  }
  const guess = (navigator.language || "pt").slice(0, 2).toLowerCase();
  return I18N[guess] ? guess : "pt";
})();

// Falls back to Portuguese, then to the key itself, so a missing string shows
// something readable instead of blanking the element.
function t(key) {
  const table = I18N[currentLang] || I18N.pt;
  return table[key] || I18N.pt[key] || key;
}

function applyTranslations(root) {
  const scope = root || document;
  scope.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  scope.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  scope.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });
}

function syncLangButtons() {
  document.querySelectorAll(".lang__btn").forEach((btn) => {
    const on = btn.dataset.lang === currentLang;
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-pressed", String(on));
  });
}

function setLanguage(lang) {
  if (!I18N[lang]) return;
  currentLang = lang;
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    // Not being able to remember the choice is not worth failing over
  }
  document.documentElement.lang = HTML_LANG[lang];
  applyTranslations();
  syncLangButtons();
  // Anything built by JS — product cards, the cart — redraws itself on this.
  document.dispatchEvent(new CustomEvent("rl:languagechange"));
}

document.querySelectorAll(".lang__btn").forEach((btn) => {
  const flag = FLAGS[btn.dataset.lang];
  if (flag) btn.innerHTML = `${flag}<span class="lang__code">${btn.textContent.trim()}</span>`;
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

document.documentElement.lang = HTML_LANG[currentLang];
applyTranslations();
syncLangButtons();
