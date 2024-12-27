;; Space Data Integration Contract

(define-map space-missions
  { mission-id: uint }
  {
    name: (string-ascii 64),
    launch-date: uint,
    target-asteroid: (string-ascii 64),
    data: (string-utf8 1024)
  }
)

(define-data-var mission-nonce uint u0)

(define-constant contract-owner tx-sender)

(define-public (add-space-mission (name (string-ascii 64)) (launch-date uint) (target-asteroid (string-ascii 64)) (data (string-utf8 1024)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) (err u403))
    (let
      (
        (new-id (+ (var-get mission-nonce) u1))
      )
      (map-set space-missions
        { mission-id: new-id }
        {
          name: name,
          launch-date: launch-date,
          target-asteroid: target-asteroid,
          data: data
        }
      )
      (var-set mission-nonce new-id)
      (ok new-id)
    )
  )
)

(define-public (update-mission-data (mission-id uint) (new-data (string-utf8 1024)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) (err u403))
    (let
      (
        (mission (unwrap! (map-get? space-missions { mission-id: mission-id }) (err u404)))
      )
      (ok (map-set space-missions
        { mission-id: mission-id }
        (merge mission { data: new-data })))
    )
  )
)

(define-read-only (get-space-mission (mission-id uint))
  (map-get? space-missions { mission-id: mission-id })
)

