import React from 'react';
import { DINO_PRICES } from './constants';

interface ShopProps {
  selected: number;
  onSelect: (id: number) => void;
  onBuy: (id: number, price: number) => boolean;
  onClose: () => void;
  gold: number;
  ownedDinos: number[];
}

export function Shop({ selected, onSelect, onBuy, onClose, gold, ownedDinos }: ShopProps) {
  const dinos = [1, 2, 3, 4];

  const handleCardClick = (id: number) => {
    const isOwned = ownedDinos.includes(id);
    if (isOwned) {
      onSelect(id);
    } else {
      const price = DINO_PRICES[id];
      if (gold >= price) {
        onBuy(id, price);
      }
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>CỬA HÀNG KHỦNG LONG</h2>
        <div style={styles.goldDisplay}>🪙 Vàng hiện có: {gold}</div>

        <div style={styles.grid}>
          {dinos.map(id => {
            const isOwned = ownedDinos.includes(id);
            const isSelected = selected === id;
            const price = DINO_PRICES[id];
            const canAfford = gold >= price;

            return (
              <div
                key={id}
                style={{
                  ...styles.card,
                  borderColor: isSelected ? '#4CAF50' : isOwned ? '#535353' : '#ddd',
                  backgroundColor: isSelected ? '#f0fff0' : isOwned ? '#f9f9f9' : '#fff',
                  opacity: !isOwned && !canAfford ? 0.7 : 1
                }}
                onClick={() => handleCardClick(id)}
              >
                <div style={styles.imageContainer}>
                  <img
                    src={`/assets/dino_sprites/dino_${id}.png`}
                    alt={`Dino ${id}`}
                    style={styles.sprite}
                  />
                </div>
                <div style={styles.dinoName}>Mẫu {id}</div>

                {!isOwned && (
                  <div style={styles.priceTag}>
                    🪙 {price}
                  </div>
                )}

                {isSelected && <div style={styles.selectedBadge}>Đang chọn</div>}
                {isOwned && !isSelected && <div style={styles.ownedBadge}>Đã có</div>}
              </div>
            );
          })}
        </div>

        <button style={styles.closeButton} onClick={onClose}>
          ĐÓNG
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    width: '90%',
    maxWidth: '350px', // Nhỏ hơn nữa
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    margin: '0 0 5px 0',
    fontFamily: 'monospace',
    fontSize: '18px', // Chữ tiêu đề nhỏ hơn
    color: '#333',
  },
  goldDisplay: {
    fontFamily: 'monospace',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: '15px',
    backgroundColor: '#fffbe6',
    padding: '4px 12px',
    borderRadius: '12px',
    border: '1px solid #ffe58f'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)', // 4 cột để chúng nằm ngang ngang
    gap: '8px',
    width: '100%',
    marginBottom: '15px',
  },
  card: {
    border: '2px solid', // Viền mỏng hơn
    borderRadius: '8px',
    padding: '8px 4px', // Padding nhỏ
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    transition: 'all 0.2s',
  },
  imageContainer: {
    width: '36px',
    height: '36px',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: '5px',
  },
  sprite: {
    height: '100%',
    objectFit: 'none',
    objectPosition: '0 0',
    imageRendering: 'pixelated',
    transform: 'scale(1.5)', // Khủng long nhỏ hơn một chút
    transformOrigin: 'top left',
  },
  dinoName: {
    fontFamily: 'monospace',
    fontSize: '10px', // Chữ tên nhỏ hơn
    fontWeight: 'bold',
    color: '#535353',
  },
  priceTag: {
    fontFamily: 'monospace',
    fontSize: '9px',
    color: '#D4AF37',
    marginTop: '4px',
    fontWeight: 'bold',
  },
  selectedBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '1px 4px',
    borderRadius: '8px',
    fontSize: '8px',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    zIndex: 1,
  },
  ownedBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#535353',
    color: 'white',
    padding: '1px 4px',
    borderRadius: '8px',
    fontSize: '8px',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    zIndex: 1,
  },
  closeButton: {
    padding: '6px 20px',
    backgroundColor: '#535353',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
  }
};
