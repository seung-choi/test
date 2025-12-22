'use client';

import React, { useState } from 'react';
import styles from '@/styles/components/modal/ErpSearchModal.module.scss';
import { ErpProduct, ErpSearchType } from '@/types/erp';
import CustomSelect from '@/components/common/CustomSelect';
import { erpMockData } from '@/mock/erpMockData';
import {formatPrice} from "@/utils";

interface ErpSearchModalContentProps {
  onSelect: (product: ErpProduct) => void;
  onClose: () => void;
}

const ErpSearchModalContent: React.FC<ErpSearchModalContentProps> = ({
  onSelect,
  onClose,
}) => {
  const [searchType, setSearchType] = useState<ErpSearchType>('상품 코드');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ErpProduct[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      alert('검색어를 입력하세요.');
      return;
    }

    const results = erpMockData.filter((product) => {
      if (searchType === '상품 코드') {
        return product.code.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return product.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
    });

    setSearchResults(results);
    setHasSearched(true);
  };

  const handleSelectProduct = (product: ErpProduct) => {
    onSelect(product);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>ERP 검색</div>
      </div>

      <div className={styles.divider} />

      <div className={styles.content}>
        <div className={styles.searchSection}>
          <CustomSelect
            value={searchType}
            onChange={(value) => setSearchType(value as ErpSearchType)}
            options={[
              { value: '상품 코드', label: '상품 코드' },
              { value: '상품명', label: '상품명' },
            ]}
            className={styles.searchTypeSelect}
          />
          <div className={styles.searchInputGroup}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={`${searchType}를 입력하세요`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <button className={styles.searchButton} onClick={handleSearch}>
              <div className={styles.buttonText}>검색</div>
            </button>
          </div>
        </div>

        <div className={styles.resultLabel}>검색 결과</div>

        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <div className={styles.categoryColumn}>
              <div className={styles.headerText}>분류</div>
            </div>
            <div className={styles.codeColumn}>
              <div className={styles.headerText}>상품 코드</div>
            </div>
            <div className={styles.nameColumn}>
              <div className={styles.headerText}>상품명</div>
            </div>
            <div className={styles.priceColumn}>
              <div className={styles.headerText}>금액</div>
            </div>
            <div className={styles.selectColumn}>
              <div className={styles.headerText}>선택</div>
            </div>
          </div>

          <div className={styles.tableBody}>
            {hasSearched && searchResults.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyText}>검색 결과가 없습니다.</div>
              </div>
            ) : (
              searchResults.map((product) => (
                <div
                  key={product.id}
                  className={styles.tableRow}
                  onClick={() => handleSelectProduct(product)}
                >
                  <div className={styles.categoryColumn}>
                    <div className={styles.cellText}>{product.category}</div>
                  </div>
                  <div className={styles.codeColumn}>
                    <div className={styles.cellText}>{product.code}</div>
                  </div>
                  <div className={styles.nameColumn}>
                    <div className={styles.cellText}>{product.name}</div>
                  </div>
                  <div className={styles.priceColumn}>
                    <div className={styles.cellText}>{formatPrice(product.price)}</div>
                  </div>
                  <div className={styles.selectColumn}>
                    <div className={styles.cellText}>선택</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.gradient} />
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default ErpSearchModalContent;
