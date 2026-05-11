import React from 'react';

interface ShopProps {
  selected: number;
  onSelect: (id: number) => void;
  onClose: () => void;
}

export function Shop({ selected, onSelect, onClose }: ShopProps) {
  const dinos = [1, 2, 3, 4];

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>CỬA HÀNG KHỦNG LONG</h2>

        <div style={styles.grid}>
          {dinos.map(id => (
            <div
              key={id}
              style={{
                ...styles.card,
                borderColor: selected === id ? '#4CAF50' : '#ddd',
                backgroundColor: selected === id ? '#f0fff0' : '#fff'
              }}
              onClick={() => onSelect(id)}
            >
              <div style={styles.imageContainer}>
                {/* We use object-position to show the idle frame from the sprite sheet */}
                <img
                  src={`/assets/dino_sprites/dino_${id}.png`}
                  alt={`Dino ${id}`}
                  style={styles.sprite}
                />
              </div>
              <div style={styles.dinoName}>Mẫu {id}</div>
              {selected === id && <div style={styles.selectedBadge}>Đã chọn</div>}
            </div>
          ))}
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
    margin: '0 0 15px 0',
    fontFamily: 'monospace',
    fontSize: '18px', // Chữ tiêu đề nhỏ hơn
    color: '#333',
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
