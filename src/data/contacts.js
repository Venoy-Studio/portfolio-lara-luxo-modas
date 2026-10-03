// Contatos Fictícios para Lara Luxo Modas
export const CONTACTS = {
  storeName: 'Lara Luxo Modas',
  tagline: 'Se é tendência, você encontra aqui.',
  
  // WhatsApp Fictício
  whatsapp: '(11) 98765-4321',
  whatsappRaw: '5511987654321',
  
  // Telefone Fixo Fictício
  phone: '(11) 3456-7890',
  
  // E-mails Fictícios
  email: 'atendimento@laraluxomodas.com.br',
  emailPress: 'imprensa@laraluxomodas.com.br',
  
  // Endereço Físico Fictício
  address: {
    street: 'Av. Pres. Kennedy, 7420',
    complement: 'Galeria Boulevard, Loja 14',
    neighborhood: 'Ocian',
    city: 'Praia Grande',
    state: 'SP',
    zip: '11704-000',
    full: 'Av. Pres. Kennedy, 7420, Galeria Boulevard, Loja 14 · Ocian, Praia Grande/SP'
  },
  
  // Horário de Funcionamento
  hours: {
    weekdays: 'Segunda a Sábado: 10h às 19h30',
    sunday: 'Domingos e Feriados: 11h às 17h'
  },
  
  // Redes Sociais Fictícias
  social: {
    instagram: 'https://www.instagram.com/laraluxomodas.oficial/',
    instagramHandle: '@laraluxomodas.oficial',
    tiktok: 'https://www.tiktok.com/@laraluxomodas',
    tiktokHandle: '@laraluxomodas'
  },
  
  // Dados Fiscais Fictícios
  legal: {
    cnpj: '45.892.110/0001-92',
    companyName: 'Lara Luxo Modas & Confecções Ltda.',
    pixKey: '45.892.110/0001-92'
  },

  // Link do Google Maps (busca pelo endereço fictício)
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Av. Pres. Kennedy, 7420 - Ocian, Praia Grande - SP')
};

export const getWaLink = (message = 'Olá! Vim pelo site da Lara Luxo e gostaria de tirar uma dúvida.') => {
  return `https://wa.me/${CONTACTS.whatsappRaw}?text=${encodeURIComponent(message)}`;
};
